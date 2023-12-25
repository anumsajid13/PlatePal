const authenticateToken = require('../../TokenAuthentication/token_authentication');
const express = require('express');
const router = express.Router();
const RecipeSeeker = require('../../models/RecipeSeekerSchema');

router.get('/recipeSeeker/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const recipeSeeker = await RecipeSeeker.findById(userId);

    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    const { _id, name, email, profilePicture, address, creditCardInfo, recipeBookmarks, followings, notifications } = recipeSeeker;

    // If profilePicture exists, convert it to a base64 data URL
    const profilePictureData = profilePicture
      ? `data:${profilePicture.contentType};base64,${profilePicture.data.toString('base64')}`
      : null;

    const recipeSeekerData = {
      _id,
      name,
      email,
      profilePicture: profilePictureData,
      address,
      creditCardInfo,
      recipeBookmarks,
      followings,
      notifications,
    };

    res.status(200).json(recipeSeekerData);
  } catch (error) {
    console.error('Error fetching RecipeSeeker:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
