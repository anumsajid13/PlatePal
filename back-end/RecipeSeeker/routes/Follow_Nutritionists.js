const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const Nutritionist = require('../../models/Nutritionist Schema')
const nutritionist_Notification = require('../../models/Nutritionist_Notification Schema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');

// Route for a RecipeSeeker to follow a Chef
router.post('/followNut/:nutId', authenticateToken, async (req, res) => {
    try {
      const { nutId } = req.params;
      const recipeSeekerId = req.user.id; 
      console.log("inside follow routee")
      // Check if the Chef exists
      const nutritionist = await Nutritionist.findById(nutId);
      if (!nutritionist) {
        return res.status(404).json({ message: 'Nutritionist not found' });
      }
  
      // Check if the RecipeSeeker exists
      const recipeSeeker = await RecipeSeeker.findById(recipeSeekerId);
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'RecipeSeeker not found' });
      }
  
      // Check if the RecipeSeeker is already following the nutritionist
      if (recipeSeeker.followings.includes(nutId)) {
        return res.status(400).json({ message: 'RecipeSeeker is already following the Nutritionist' });
      }
  
      // Add the Nutritionist to the RecipeSeeker's followings
      recipeSeeker.followings.push(nutId);
      await recipeSeeker.save();
  
      // Add the RecipeSeeker to the  followers
      nutritionist.followers.push(recipeSeekerId);
      await nutritionist.save();
  
      // Create a notification for the Chef
      const notificationText = `${recipeSeeker.name} started following you.`;
      const nut_Notification = new nutritionist_Notification({
        user: nutId,
        sender:recipeSeekerId,
        type: 'follower alert',
        notification_text: notificationText,
      });
      await nut_Notification.save();
  
      res.status(201).json({ message: 'RecipeSeeker is now following the Nutritionist ' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  router.post('/unfollowNut/:nutId', authenticateToken, async (req, res) => {
    try {
      const { nutId } = req.params;
      const recipeSeekerId = req.user.id;
  
      const nut = await Nutritionist.findById(nutId);
      if (!nut) {
        return res.status(404).json({ message: 'Nutritionist not found' });
      }
  
      const recipeSeeker = await RecipeSeeker.findById(recipeSeekerId);
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'RecipeSeeker not found' });
      }
  
     
      if (!recipeSeeker.followings.includes(nutId)) {
        return res.status(400).json({ message: 'RecipeSeeker is not following the Nut' });
      }
  
      await RecipeSeeker.updateOne({ _id: recipeSeekerId }, { $pull: { followings: nutId } });
  
     
      await Nutritionist.updateOne({ _id: nutId }, { $pull: { followers: recipeSeekerId } });
  
 
      const notificationText = `${recipeSeeker.name} stopped following you.`;
      const nutritionistNotification = new nutritionist_Notification({
        user: nutId,
        type: 'unfollow',
        sender:recipeSeekerId,
        notification_text: notificationText,
      });
      await nutritionistNotification.save();
  
      res.status(200).json({ message: 'RecipeSeeker is now unfollowing the Nutritionist' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  

  
router.get('/nutritionist-followings', authenticateToken, async (req, res) => {
  try {
    const recipeSeekerId = req.user.id; 
     console.log("user id: ",recipeSeekerId)
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