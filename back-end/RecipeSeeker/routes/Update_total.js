
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const MealPlan = require('../../models/mealPlanSchema');
const NTransaction = require('../../models/Nut-Trans');
const Recipe = require('../../models/Recipe Schema');
const RecipeSeeker=require('../../models/RecipeSeekerSchema')
const Nutritionist=require('../../models/Nutritionist Schema')
const Cart=require('../../models/Cart Schema')


router.post('/update-total-amount', authenticateToken, async (req, res) => {
    
    console.log("helloooo")
    const { increasedAmount } = req.body;
       
    try {

        console.log("inside update-total-amount")
        const cart = await Cart.findOne({ recipeSeekerId: req.user.id });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.totalAmount = cart.totalAmount+increasedAmount;
  
      const updatedCart = await cart.save();
  
      res.json(updatedCart);
    } catch (error) {
      console.error('Error updating total amount:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

module.exports = router;

  
