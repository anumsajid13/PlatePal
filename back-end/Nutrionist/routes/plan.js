const express = require('express');
const router = express.Router();
const Nutritionist = require('../../models/Nutritionist Schema');
const MealPlan = require('../../models/MealPlanSchema');
const Recipe = require('../../models/Recipe Schema');
const NutritionistNotification = require('../../models/Nutritionist_Notification Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const User_Notification= require('../../models/User_Notification Schema');

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
        _id: recipe._id,
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

//create meal plan
router.post('/create-meal-plan',authenticateToken, async (req, res) => {
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

    
    // Populate the 'user' field with the 'username' field from the User model
    await newMealPlan.populate('user', 'username').execPopulate();

    await newMealPlan.save();

    return res.json({ message: 'Meal plan created successfully', mealPlan: newMealPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to get unseen nutritionist notifications
router.get('/unseen-notifications',authenticateToken, async (req, res) => {
  try {
    const unseenNotifications = await NutritionistNotification.find({ seen: false }).populate('user sender');
    res.json(unseenNotifications);
  } catch (error) {
    console.error('Error fetching unseen nutritionist notifications:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// to change bool to seen 
router.post('/n-createplan/:notificationId', async (req, res) => {
  const { notificationId } = req.params;

  try {
    // Update the seen status in MongoDB
    await NutritionistNotification.findByIdAndUpdate(notificationId, { seen: true });
    res.status(200).json({ success: true, message: 'Plan created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Endpoint to send a notification
router.post('/send-notification', async (req, res) => {
  try {
    const { userId, type, notification_text } = req.body;

    // Create a new notification
    const newNotification = new User_Notification({
      user: userId,
      type,
      notification_text,
    });

    // Save the notification to the database
    await newNotification.save();

    res.status(200).json({ message: 'Notification sent successfully', notification: newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get all meal plans created by a specific nutritionist
router.get('/planmade/:nutritionistId', async (req, res) => {
    try {
      const nutritionistId = req.params.nutritionistId;

      // Get all meal plans created by the specific nutritionist
      const mealPlans = await MealPlan.find({ nutritionist: nutritionistId });

      return res.json( mealPlans );
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
