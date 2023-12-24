const express = require('express');
const router = express.Router();
const Nutritionist = require('../../models/Nutritionist Schema');
const MealPlan = require('../../models/MealPlanSchema');
const Recipe = require('../../models/Recipe Schema');

//show all recipes
router.get('/recipes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const recipes = await Recipe.find({})
      .populate({
        path: 'ratings',
        populate: {
          path: 'user',
          model: 'RecipeSeeker',
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          model: 'RecipeSeeker',
        },
      })
      .populate({
        path: 'chef',
        model: 'Chef',
        select: 'name', // Select only the 'name' field of the Chef
      })
      .skip(skip)
      .limit(pageSize)
      .select('title description ingredients allergens calories recipeImage chef')
      .exec();

    const recipesWithBase64Image = recipes.map((recipe) => {
      const uint8Array = new Uint8Array(recipe.recipeImage.data);
      const base64ImageData = Buffer.from(uint8Array).toString('base64');
      return {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        allergens: recipe.allergens,
        calories: recipe.calories,
        recipeImage: { data: base64ImageData, contentType: recipe.recipeImage.contentType },
        chef: recipe.chef,
      };
    });

    res.status(200).json(recipesWithBase64Image);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.post('/create-meal-plan', async (req, res) => {
  try {
    const { user, recipes, bmi } = req.body;

    // Check if the user making the request is a nutritionist
    // Adjust this check based on your authentication and authorization logic
    const requestingNutritionistId = req.user.id; // Replace this with your actual way of getting the nutritionist ID

    const nutritionist = await Nutritionist.findById(requestingNutritionistId);

    if (!nutritionist) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }

    // Calculate min and max calories from the recipes
    const recipeCalories = await Promise.all(
      recipes.map(async (recipeId) => {
        const recipe = await Recipe.findById(recipeId);
        return recipe.calories;
      })
    );

    const minCalories = Math.min(...recipeCalories);
    const maxCalories = Math.max(...recipeCalories);

    // Create a new meal plan with min and max calories
    const newMealPlan = new MealPlan({
      user,
      nutritionist: nutritionist._id,
      recipes,
      bmi,
      calorieRange: {
        min: minCalories,
        max: maxCalories,
      },
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
