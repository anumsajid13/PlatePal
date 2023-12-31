const express = require('express');
const router = express.Router();
const Order = require('../../models/Order Schema');
const Transaction=require('../../models/Transaction')
const Recipe = require('../../models/Recipe Schema');
const Cart = require('../../models/Cart Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

router.post('/addOrder', authenticateToken, async (req, res) => {
    try {
        const { items } = req.body;
      
          //   console.log("IDS: ",items[0].chef," waitt  ", items[0].vendorId)
          const existingCart = await Cart.findOne({ recipeSeekerId: req.user.id });
      
          if (!existingCart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
      
          // Checking if the recipe already exists in the orders
          const existingOrderIndex = existingCart.orders.findIndex(order => {
            return order.items[0] && order.items[0].recipe && order.items[0].recipe.toString() === items[0].recipe;
           });
        
      //  console.log("existingOrderIndex", existingCart.orders[existingOrderIndex].items[0].chef);
        
        if (existingOrderIndex !== -1) {
          
            console.log("Recipe exists");
            if (existingCart.orders[existingOrderIndex].items[0]) {
                existingCart.orders[existingOrderIndex].items[0].quantity += items[0].quantity;
            }
        } else {
            // If the recipe doesn't exist, create a new order
            console.log("Recipe does not exist");
            const newOrder = new Order({ items });
            existingCart.orders.push(newOrder);
            console.log(items);
        }

          // Update the total amount
          existingCart.totalAmount += items.reduce((total, item) => total + item.price * item.quantity, 0);
    
          const savedCart = await existingCart.save();
          console.log("Saved cart orders: ",savedCart.orders[0].items[0].recipe)
          res.json(savedCart);
            
      
      

   
    } catch (error) {
      console.error('Error adding order to cart:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
router.get('/cartDetails', authenticateToken, async (req, res) => {
    try {
     
      const cart = await Cart.findOne({ recipeSeekerId: req.user.id }).populate('orders.items.recipe');
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      res.json(cart);
    } catch (error) {
      console.error('Error fetching cart details:', error.message);
      res.status(500).send('Internal Server Error');
    }
});

router.delete('/removeItem/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const existingCart = await Cart.findOne({ recipeSeekerId: req.user.id });

    if (!existingCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    
    const existingOrderIndex = existingCart.orders.findIndex(order => order.items[0]._id.equals(orderId));

    if (existingOrderIndex === -1) {
      return res.status(404).json({ message: 'Order not found in the cart' });
    }

   
    existingCart.orders.splice(existingOrderIndex, 1);

    
    existingCart.totalAmount = existingCart.orders.reduce((total, order) => {
      return total + order.items.reduce((orderTotal, item) => orderTotal + item.price * item.quantity, 0);
    }, 0);

    
    const savedCart = await existingCart.save();

    res.json(savedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/logout', authenticateToken, async (req, res) => {
  try {
    console.log("user logging out: ",req.user.id)
    // Clear the cart for the logged-in RecipeSeeker
    await Cart.findOneAndDelete({ recipeSeekerId: req.user.id });
     console.log("Deleted")
    // Logout the user by destroying the token
    res.clearCookie('token').status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/latestTransaction',authenticateToken, async (req, res) => {
  try {
   
    const userId = req.user.id;
    console.log(userId);
    const latestTransaction = await Transaction.findOne({ recipeseekerId: userId })
      .sort({ checkoutDate: -1 })
      .populate({
        path: 'recipes',
        populate: {
          path: 'recipeId',
          model: 'Recipe',
        },
      })
      .exec();

    if (!latestTransaction) {
      return res.status(404).json({ message: 'No transactions found for the user' });
    }

    const recipesWithBase64Image = latestTransaction.recipes.map(recipe => {
      const uint8Array = new Uint8Array(recipe.recipeId.recipeImage.data);
      const base64ImageData = Buffer.from(uint8Array).toString('base64');
      return {
        ...recipe.toObject(),
        recipeId: {
          ...recipe.recipeId.toObject(),
          recipeImage: { data: base64ImageData, contentType: recipe.recipeId.recipeImage.contentType }
        }
      };
    });

  
    const response = {
      OrderId:latestTransaction._id,
      totalAmount: latestTransaction.totalAmount,
      checkoutDate: latestTransaction.checkoutDate,
      isDelivered: latestTransaction.isDelivered,
      recipes: recipesWithBase64Image,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error retrieving latest transaction:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/allTransactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const allTransactions = await Transaction.find({ recipeseekerId: userId })
      .sort({ checkoutDate: -1 })
      .populate({
        path: 'recipes',
        populate: {
          path: 'recipeId',
          model: 'Recipe',
        },
      })
      .exec();

    if (!allTransactions || allTransactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the user' });
    }

    const transactionsWithBase64Image = allTransactions.map(transaction => ({
      OrderId: transaction._id,
      totalAmount: transaction.totalAmount,
      checkoutDate: transaction.checkoutDate,
      isDelivered: transaction.isDelivered,
      recipes: transaction.recipes.map(recipe => {
        const uint8Array = new Uint8Array(recipe.recipeId.recipeImage.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...recipe.toObject(),
          recipeId: {
            ...recipe.recipeId.toObject(),
            recipeImage: { data: base64ImageData, contentType: recipe.recipeId.recipeImage.contentType }
          }
        };
      }),
    }));

    res.status(200).json(transactionsWithBase64Image);

  } catch (error) {
    console.error('Error retrieving all transactions:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;
