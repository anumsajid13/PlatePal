const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Chef = require('../../models/Chef Schema');

router.get('/followings', authenticateToken, async (req, res) => {
  try {
    const recipeSeekerId = req.user.id; 

    const recipeSeeker = await RecipeSeeker.findById(recipeSeekerId);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    const populatedRecipeSeeker = await recipeSeeker
      .populate({
        path: 'followings',
        select: 'name ', 
      });

    const followingsWithNames = populatedRecipeSeeker.followings;

    res.status(200).json({ followings: followingsWithNames });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
