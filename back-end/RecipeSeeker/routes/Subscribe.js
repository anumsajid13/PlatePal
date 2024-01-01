const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const MealPlan = require('../../models/mealPlanSchema');
const NTransaction = require('../../models/Nut-Trans');
const Recipe = require('../../models/Recipe Schema');
const RecipeSeeker=require('../../models/RecipeSeekerSchema')
const Nutritionist=require('../../models/Nutritionist Schema')
const Cart=require('../../models/Cart Schema')
const Nutritionist_Notification=require('../../models/Nutritionist_Notification Schema')

router.put('/subscribe/:mealPlanId', async (req, res) => {
    const { mealPlanId } = req.params;
    console.log('Received request to subscribe to meal plan with ID:', mealPlanId);
  
    try {
      const updatedMealPlan = await MealPlan.findByIdAndUpdate(
        mealPlanId,
        { isSubscribed: true },
        { new: true }
      );
  
      if (!updatedMealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
  
      res.json(updatedMealPlan);
    } catch (error) {
      console.error('Error updating meal plan:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


router.post('/fill-nut-transaction/:mealPlanId',authenticateToken, async (req, res) => {
  const { mealPlanId } = req.params;

  try {

    console.log("inside fill nut")
  
    const mealPlan = await MealPlan.findById(mealPlanId)
      .populate('user') 
      .populate('nutritionist')
      .populate('recipes'); 

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Extract required details from the meal plan
    const { user, nutritionist, recipes, amount } = mealPlan;

    // Fetch the corresponding Recipe documents
    const fetchedRecipes = await Recipe.find({ _id: { $in: recipes } });

    // Create a new NutTrans document
    const nutTrans = new NTransaction({
      NutId: nutritionist._id,
      sender: user._id,
      recipes: fetchedRecipes, 
      Paid:200
    });

    await Nutritionist.findByIdAndUpdate(nutritionist._id, { $inc: { balance: 200 } });

    const savedNutTrans = await nutTrans.save();
     // Send notification to the nutritionist
     const notification = new Nutritionist_Notification({
        user: nutritionist._id,
        sender: user._id,
        type: 'subscription',
        notification_text: 'User subscribed to your meal plan',
        bmi: mealPlan.bmi,
        Paid:200
      });
  
      await notification.save();

    res.json(savedNutTrans);
  } catch (error) {
    console.error('Error filling NutTransSchema:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/increase-subscription', authenticateToken,async (req, res) => {
    const recipeSeekerId  = req.user.id;
    try {
        console.log("inside increase-subscription")
        console.log("inside increase-subscription: user id is: ",recipeSeekerId)
   
      const updatedRecipeSeeker = await RecipeSeeker.findByIdAndUpdate(
        recipeSeekerId,
        { $inc: { SubscribtionCount: 1 } },
        { new: true }
      );
  
      if (!updatedRecipeSeeker) {
        return res.status(404).json({ message: 'Recipe seeker not found' });
      }
  
      res.json(updatedRecipeSeeker);
    } catch (error) {
      console.error('Error increasing subscription count:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

 

module.exports = router;

  
  