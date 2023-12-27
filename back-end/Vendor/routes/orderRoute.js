const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

/* // Endpoint to retrieve all carts with orders for a vendor
router.get('/', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id;
  
      // Find all carts with orders that match the vendorId
      const carts = await Cart.find({
        'orders.items.vendorId': vendorId,
      })
      .populate({
        path: 'recipeSeekerId',
        model: 'RecipeSeeker',
        select: 'name _id', // Specify the fields you want to retrieve
      })
      .populate({
        path: 'orders.items.recipe',
        model: 'Recipe',
        select: 'title _id', // Specify the fields you want to retrieve
      })
      .populate({
        path: 'orders.items.chefId',
        model: 'Chef',
        select: 'name _id', // Specify the fields you want to retrieve
      });
  
      res.json(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

router.get('/', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id;
      const { sortBy, sortOrder, filterType, filterValue } = req.query;
  
      const query = {};
  
      if (filterType && filterValue) {
        console.log("filter type",filterType,"filter value",filterValue);
        
        if (filterType === 'chef') {
          query['orders.items.chefId.name'] = { $regex: new RegExp(filterValue, 'i') };
        } else if (filterType === 'recipe') {
            console.log("filter value",filterValue);
          query['orders.items.name'] = { $regex: new RegExp(filterValue, 'i') };
         
        } else if (filterType === 'recipeSeeker') {
          query['recipeSeekerId.name'] = { $regex: new RegExp(filterValue, 'i') };
        }
      }
  
      // Sorting
      const sort = {};
      if (sortBy && sortOrder && (sortBy === 'Time' || sortBy === 'time')) {
        // Assuming 'Time' is the field you want to sort by
        sort[sortBy.toLowerCase()] = sortOrder === 'desc' ? -1 : 1;
      }
  
      // Find all carts with orders that match the vendorId and apply filtering
      const carts = await Cart.find({
        'orders.items.vendorId': vendorId,
        ...query, // Spread the query object to apply dynamic filters
      })
        .populate({
          path: 'recipeSeekerId',
          model: 'RecipeSeeker',
          select: 'name _id',
        })
        .populate({
          path: 'orders.items.recipe',
          model: 'Recipe',
          select: 'title _id',
        })
        .populate({
          path: 'orders.items.chefId',
          model: 'Chef',
          select: 'name _id',
        })
        .sort(sort); // Apply sorting
  
      res.json(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Endpoint to retrieve a single cart by cart ID
router.get('/:cartId', authenticateToken, async (req, res) => {
  try {
    const cartId = req.params.cartId;

    // Find the cart by ID
    const cart = await Cart.findById(cartId)
      .populate({
        path: 'recipeSeekerId',
        model: 'RecipeSeeker',
      })
      .populate({
        path: 'orders.items.recipe',
        model: 'Recipe',
      })
      .populate({
        path: 'orders.items.chefId',
        model: 'Chef',
      });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

  
module.exports = router;
