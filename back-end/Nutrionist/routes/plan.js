const express = require('express');
const router = express.Router();
const Nutritionist = require('../models/Nutritionist');
const MealPlan = require('../models/MealPlan');

// Endpoint to create a new meal plan
router.post('/create-meal-plan', async (req, res) => {
    try {
      const { user, recipes, bmi, calorieRange } = req.body;
  
      // Check if the user making the request is a nutritionist
      // Adjust this check based on your authentication and authorization logic
      const requestingNutritionistId = req.user.id; // Replace this with your actual way of getting the nutritionist ID
  
      const nutritionist = await Nutritionist.findById(requestingNutritionistId);
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      // Create a new meal plan
      const newMealPlan = new MealPlan({
        user,
        nutritionist: nutritionist._id,
        recipes,
        bmi,
        calorieRange,
      });
  
      await newMealPlan.save();
  
      return res.json({ message: 'Meal plan created successfully', mealPlan: newMealPlan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
// Endpoint to get all meal plans created by a specific nutritionist
router.get('/nutritionist-meal-plans/:nutritionistId', async (req, res) => {
    try {
      const nutritionistId = req.params.nutritionistId;

      // Get all meal plans created by the specific nutritionist
      const mealPlans = await MealPlan.find({ nutritionist: nutritionistId });

      return res.json({ mealPlans });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to delete a meal plan
router.delete('/delete-meal-plan/:mealPlanId', async (req, res) => {
    try {
      const mealPlanId = req.params.mealPlanId;
  
      // Find and delete the meal plan
      const deletedMealPlan = await MealPlan.findByIdAndDelete(mealPlanId);
  
      if (!deletedMealPlan) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
  
      return res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to edit a meal plan
  router.put('/edit-meal-plan/:mealPlanId', async (req, res) => {
    try {
      const mealPlanId = req.params.mealPlanId;
      const { recipes, bmi, calorieRange } = req.body;
  
      // Find and update the meal plan
      const updatedMealPlan = await MealPlan.findByIdAndUpdate(
        mealPlanId,
        { recipes, bmi, calorieRange },
        { new: true } // Return the updated meal plan
      );
  
      if (!updatedMealPlan) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
  
      return res.json({ message: 'Meal plan updated successfully', mealPlan: updatedMealPlan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;
