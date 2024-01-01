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

router.get('/get-subscription-count',authenticateToken, async (req, res) => {
  const  userId  = req.user.id;

  try {
    const recipeSeeker = await RecipeSeeker.findById(userId);

    if (!recipeSeeker) {
      return res.status(404).json({ message: 'Recipe seeker not found' });
    }

    const subscriptionCount = recipeSeeker.SubscribtionCount;
   // recipeSeeker.SubscribtionCount=0;

  //  recipeSeeker.SubscribtionCount_Paid=0;

    recipeSeeker.save();

    res.json({ subscriptionCount });
  } catch (error) {
    console.error('Error fetching subscription count:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
