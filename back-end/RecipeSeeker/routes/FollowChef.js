
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const Chef = require('../../models/Chef Schema');
const Chef_Notification = require('../../models/Chef_Notification Schema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');

// Route for a RecipeSeeker to follow a Chef
router.post('/followChef/:chefId', authenticateToken, async (req, res) => {
    try {
      const { chefId } = req.params;
      const recipeSeekerId = req.user.id; 
      console.log("inside follow routee")
      // Check if the Chef exists
      const chef = await Chef.findById(chefId);
      if (!chef) {
        return res.status(404).json({ message: 'Chef not found' });
      }
  
      // Check if the RecipeSeeker exists
      const recipeSeeker = await RecipeSeeker.findById(recipeSeekerId);
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'RecipeSeeker not found' });
      }
  
      // Check if the RecipeSeeker is already following the Chef
      if (recipeSeeker.followings.includes(chefId)) {
        return res.status(400).json({ message: 'RecipeSeeker is already following the Chef' });
      }
  
      // Add the Chef to the RecipeSeeker's followings
      recipeSeeker.followings.push(chefId);
      await recipeSeeker.save();
  
      // Add the RecipeSeeker to the Chef's followers
      chef.followers.push(recipeSeekerId);
      await chef.save();
  
      // Create a notification for the Chef
      const notificationText = `${recipeSeeker.name} started following you.`;
      const chefNotification = new Chef_Notification({
        user: chefId,
        type: 'follow',
        notification_text: notificationText,
      });
      await chefNotification.save();
  
      res.status(201).json({ message: 'RecipeSeeker is now following the Chef' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  
  module.exports = router;