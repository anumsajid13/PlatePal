// routes/displayratings.js
const express = require('express');
const router = express.Router();
const Rating = require('../../models/Rating Schema');
const Recipe = require('../../models/Recipe Schema');

router.get('/ratings/:recipeId', async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const populatedRecipe = await Recipe.findById(recipeId).populate({
      path: 'ratings',
      populate: {
        path: 'user',
        model: 'RecipeSeeker',
      },
    });

    if (!populatedRecipe.ratings) {
      return res.status(404).json({ message: 'No ratings found for the recipe' });
    }

    const ratingsWithUsernames = populatedRecipe.ratings.map((rating) => ({
      ratingNumber: rating.ratingNumber,
      user: rating.user.name, 
      user_id: rating.user._id, 
    }));

    res.status(200).json({ ratings: ratingsWithUsernames });
  } catch (error) {
    console.error('Error fetching ratings:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
