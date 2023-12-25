const authenticateToken = require('../../TokenAuthentication/token_authentication');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');

router.get('/finddetails/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const recipeSeeker = await RecipeSeeker.findById(userId);

    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    const { _id, name, email, profilePicture, address, creditCardInfo, recipeBookmarks, followings, notifications } = recipeSeeker;

    const profilePictureData = profilePicture
      ? `data:${profilePicture.contentType};base64,${profilePicture.data.toString('base64')}`
      : null;

    const recipeSeekerData = {
      _id,
      name,
      email,
      profilePicture: profilePictureData,
      creditCardInfo,
    };

    res.status(200).json(recipeSeekerData);
  } catch (error) {
    console.error('Error fetching RecipeSeeker:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

router.put('/updateProfile/:id', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.id;

    const recipeSeeker = await RecipeSeeker.findById(userId);

    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Update user information with the new data
    recipeSeeker.name = req.body.name || recipeSeeker.name;
    recipeSeeker.email = req.body.email || recipeSeeker.email;
    recipeSeeker.address = req.body.address || recipeSeeker.address;
    recipeSeeker.creditCardInfo = req.body.creditCardInfo || recipeSeeker.creditCardInfo;

    // Update profile picture if provided
    if (req.file) {
      recipeSeeker.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Save the updated user information
    await recipeSeeker.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
