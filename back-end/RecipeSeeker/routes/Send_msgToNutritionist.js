const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const UserNutritionistInbox = require('../../models/User-Nutritionist_Inbox Schema'); 
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const NutritionistNotification = require('../../models/User_Notification Schema'); 
const Nutritionist = require('../../models/Nutritionist Schema');

// Route for a RecipeSeeker to send a message to a Nutritionist
router.post('/sendMessageToNutritionist/:nutritionistId', authenticateToken, async (req, res) => {
  try {
    const { nutritionistId } = req.params;
    const { messageContent } = req.body;

    // Find the logged-in RecipeSeeker based on the token
    const recipeSeeker = await RecipeSeeker.findById(req.user.userId);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Find or create the User_Nutritionist_Inbox document
    let userNutritionistInbox = await UserNutritionistInbox.findOne({
      nutritionist: nutritionistId,
      user: recipeSeeker._id,
    });
    if (!userNutritionistInbox) {
      userNutritionistInbox = new UserNutritionistInbox({
        nutritionist: nutritionistId,
        user: recipeSeeker._id,
        messages: [],
      });
    }

    // Fetch the RecipeSeeker's name
    const recipeSeekerName = recipeSeeker.name;

    // Add the new message to the messages array with the author as the RecipeSeeker's name
    userNutritionistInbox.messages.push({
      message: messageContent,
      author: recipeSeekerName,
      time: new Date(),
    });

    const savedUserNutritionistInbox = await userNutritionistInbox.save();

    // Create a notification for the Nutritionist
    const nutritionistNotification = new NutritionistNotification({
        nutritionist: nutritionistId,
        user: recipeSeeker._id,
        type: 'Message by Recepie Seeker', 
        notification_text: `${recipeSeekerName} sent you a message.`,
        Time: new Date(),
      });
  
      // Save the NutritionistNotification document
      const savedNutritionistNotification = await nutritionistNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedUserNutritionistInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
