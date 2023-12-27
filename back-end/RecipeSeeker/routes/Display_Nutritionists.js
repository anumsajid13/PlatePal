const express = require('express');
const router = express.Router();
const Nutritionist = require('../../models/Nutritionist Schema');
const MealPlan = require('../../models/mealPlanSchema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Recipe = require('../../models/Recipe Schema');
router.get('/mealPlans', async (req, res) => {
  try {
    const mealPlans = await MealPlan.find().populate('user nutritionist recipes');

    const mealPlanDetails = await Promise.all(mealPlans.map(async (mealPlan) => {
      const recipes = await Promise.all(mealPlan.recipes.map(async (recipeId) => {
        const recipe = await Recipe.findById(recipeId)
          .populate({
            path: 'chef',
            model: 'Chef',
          })
          .populate({
            path: 'vendor',
            model: 'Vendor',
          })
          .exec();

        const uint8Array = new Uint8Array(recipe.recipeImage.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');

        return {
          ...recipe.toObject(),
          recipeImage: { data: base64ImageData, contentType: recipe.recipeImage.contentType },
        };
      }));

      const nutritionist = mealPlan.nutritionist;
      const nutritionistWithBase64Image = {
        nutritionistId: nutritionist._id,
        name: nutritionist.name,
        profilePicture: nutritionist.profilePicture
          ? `data:${nutritionist.profilePicture.contentType};base64,${nutritionist.profilePicture.data.toString('base64')}`
          : null,
      };

      return {
        mealPlanId: mealPlan._id,
        user: {
          userId: mealPlan.user._id,
          name: mealPlan.user.name,
          profilePicture: mealPlan.user.profilePicture,
        },
        nutritionist: nutritionistWithBase64Image,
        recipes: recipes,
        bmi: mealPlan.bmi,
        calorieRange: mealPlan.calorieRange,
        date: mealPlan.date,
      };
    }));

    res.status(200).json({ mealplan: mealPlanDetails });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



router.get('/allNutritionists', async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({}, 'name profilePicture email description followers' );

    const nutritionistsWithBase64Image = nutritionists.map((nutritionist) => {
      if (nutritionist.profilePicture && nutritionist.profilePicture.data && nutritionist.profilePicture.contentType) {
        if (typeof nutritionist.profilePicture === 'object') {
          const base64String = Buffer.from(nutritionist.profilePicture.data.buffer).toString('base64');
          return {
            _id: nutritionist._id,
            name: nutritionist.name,
            profilePicture: `data:${nutritionist.profilePicture.contentType};base64,${base64String}`,
            email:nutritionist.email,
            description:nutritionist.description,
            followers:nutritionist.followers
           
          };
        } else {
          return {
            _id: nutritionist._id,
            name: nutritionist.name,
            profilePicture: nutritionist.profilePicture.toString('base64'),
            email:nutritionist.email,
            description:nutritionist.description,
            followers:nutritionist.followers
          };
        }
      } else {
        return {
          _id: nutritionist._id,
          name: nutritionist.name,
          profilePicture: null,
          email:nutritionist.email,
          description:nutritionist.description,
          followers:nutritionist.followers
        };
      }
    });

    console.log(nutritionists);
    res.status(200).json({ nutritionists: nutritionistsWithBase64Image });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



module.exports = router;
