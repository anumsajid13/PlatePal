const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const Chef = require('../../models/Chef Schema');
const Chef_Notification = require('../../models/Chef_Notification Schema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');

router.post('/unfollowChef/:chefId', authenticateToken, async (req, res) => {
    try {
      const { chefId } = req.params;
      const recipeSeekerId = req.user.id;
  
      const chef = await Chef.findById(chefId);
      if (!chef) {
        return res.status(404).json({ message: 'Chef not found' });
      }
  
      const recipeSeeker = await RecipeSeeker.findById(recipeSeekerId);
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'RecipeSeeker not found' });
      }
  
      // Check if the RecipeSeeker is following the Chef
      if (!recipeSeeker.followings.includes(chefId)) {
        return res.status(400).json({ message: 'RecipeSeeker is not following the Chef' });
      }
  
      // Remove the Chef from the RecipeSeeker's followings using $pull
      await RecipeSeeker.updateOne({ _id: recipeSeekerId }, { $pull: { followings: chefId } });
  
      // Remove the RecipeSeeker from the Chef's followers using $pull
      await Chef.updateOne({ _id: chefId }, { $pull: { followers: recipeSeekerId } });
  
      // Create a notification for the Chef
      const notificationText = `${recipeSeeker.name} stopped following you.`;
      const chefNotification = new Chef_Notification({
        user: chefId,
        type: 'unfollow',
        notification_text: notificationText,
      });
      await chefNotification.save();
  
      res.status(200).json({ message: 'RecipeSeeker is now unfollowing the Chef' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  

module.exports = router;
