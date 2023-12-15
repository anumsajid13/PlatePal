const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Chef = require('../../models/Chef Schema');

// Route to get the followings of a RecipeSeeker with names of the followers
router.get('/followings', authenticateToken, async (req, res) => {
  try {
    const recipeSeekerId = req.user.userId; // Assuming the user ID is stored in the token during authentication

    // Check if the RecipeSeeker exists
    const recipeSeeker = await RecipeSeeker.findById(recipeSeekerId);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Populate the followings array with Chef documents and retrieve their names
    await recipeSeeker.populate({
      path: 'followings',
      select: 'name', // Select the 'name' field of the Chef documents
    }).execPopulate();

    const followingsWithNames = recipeSeeker.followings;

    res.status(200).json({ followings: followingsWithNames });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
