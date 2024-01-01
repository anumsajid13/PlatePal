const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const MealPlan = require('../../models/mealPlanSchema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const NutritionistNotification = require('../../models/Nutritionist_Notification Schema');


router.post('/setBMIAndCreateMealPlan', authenticateToken, async (req, res) => {
  try {
    const { bmi, nut_Id } = req.body;

    const recipeSeeker = await RecipeSeeker.findById(req.user.userId);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    const mealPlan = new MealPlan({
      user: recipeSeeker._id,
      nutritionist: nut_Id,
      bmi: bmi,
      recipes: [],
    });

    const savedMealPlan = await mealPlan.save();

    const nutritionistNotification = new NutritionistNotification({
      nutritionist: chefId,
      user: recipeSeeker._id,
      type: 'meal_plan_request',
      notification_text: `${recipeSeeker.name} has requested a meal plan.`,
      Time: new Date(),
    });

    const savedNutritionistNotification = await nutritionistNotification.save();

    res.status(201).json({ message: 'Meal plan created successfully', data: savedMealPlan });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



module.exports = router;
