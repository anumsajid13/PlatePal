const express = require('express');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Recipe = require('../../models/Recipe Schema');

const router = express.Router();

// Route to add a recipe to the recipeFavourites array
router.post('/add-to-favourites/:recipeId', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const userId = req.user.id;

    const recipeSeeker = await RecipeSeeker.findById(userId);
    const recipe = await Recipe.findById(recipeId);
    if (!recipeSeeker || !recipe) {
      return res.status(404).json({ message: 'Recipe Seeker or Recipe not found' });
    }
    // Check if the recipe is already in the favourites
    if (!recipeSeeker.recipeFavourites.includes(recipeId)) {
      recipeSeeker.recipeFavourites.push(recipeId);
      await recipeSeeker.save();

      res.status(200).json({ message: 'Recipe added to favourites successfully' });
    } else {
      res.status(400).json({ message: 'Recipe is already in favourites' });
    }
  } catch (error) {
    console.error('Error adding recipe to favourites:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Route to fetch recipes in the recipeFavourites array
router.get('/favourite-recipes', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const recipeSeeker = await RecipeSeeker.findById(userId).populate({
        path: 'recipeFavourites',
        populate: [
          {
            path: 'chef',
            model: 'Chef',
          },
          {
            path: 'vendor',
            model: 'Vendor',
          },
        ],
      }).exec();
  
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'Recipe Seeker not found' });
      }
  
      const favouriteRecipes = recipeSeeker.recipeFavourites.map(recipe => {
        const uint8Array = new Uint8Array(recipe.recipeImage.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...recipe.toObject(),
          recipeImage: { data: base64ImageData, contentType: recipe.recipeImage.contentType }
        };
      });
  
      res.status(200).json({ favouriteRecipes });
    } catch (error) {
      console.error('Error fetching favourite recipes:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

module.exports = router;

router.get('/is-in-favorites/:recipeId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const recipeId = req.params.recipeId;
  
      const user = await RecipeSeeker.findById(userId);
      const isInFavorites = user.recipeFavourites.includes(recipeId);
  
      res.status(200).json({ isInFavorites });
    } catch (error) {
      console.error('Error checking if recipe is in favorites:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  router.post('/remove-from-favourites/:recipeId', authenticateToken, async (req, res) => {
    try {
      const recipeId = req.params.recipeId;
      const userId = req.user.id;
  
      const recipeSeeker = await RecipeSeeker.findById(userId);
  
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'Recipe Seeker not found' });
      }
  
      // Check if the recipe is in the favourites
      const recipeIndex = recipeSeeker.recipeFavourites.indexOf(recipeId);
  
      if (recipeIndex !== -1) {
        // Recipe found, remove it from the favourites
        recipeSeeker.recipeFavourites.splice(recipeIndex, 1);
        await recipeSeeker.save();
  
        res.status(200).json({ message: 'Recipe removed from favourites successfully' });
      } else {
        // Recipe not found in the favourites
        res.status(404).json({ message: 'Recipe not found in favourites' });
      }
    } catch (error) {
      console.error('Error removing recipe from favourites:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
