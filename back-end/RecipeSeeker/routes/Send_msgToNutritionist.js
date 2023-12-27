const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const User_Nutritionist_Inbox = require('../../models/User-Nutritionist_Inbox Schema'); 
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const NutritionistNotification = require('../../models/User_Notification Schema'); 
const Nutritionist = require('../../models/Nutritionist Schema');

// Route for a RecipeSeeker to send a message to a Nutritionist
router.post('/sendMessageToNutritionist/:nutritionistId', authenticateToken, async (req, res) => {
  try {
    const { nutritionistId } = req.params;
    const { messageContent } = req.body;
    console.log('messageContent',messageContent)
    // Find the logged-in RecipeSeeker based on the token
    const recipeSeeker = await RecipeSeeker.findById(req.user.id);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Find or create the User_Nutritionist_Inbox document
    let userNutritionistInbox = await User_Nutritionist_Inbox.findOne({
      nutritionist: nutritionistId,
      user: recipeSeeker._id,
    });
    if (!userNutritionistInbox) {
     
      userNutritionistInbox = new User_Nutritionist_Inbox({
        nutritionist: nutritionistId,
        user: recipeSeeker._id,
        messages: [],
      });
      console.log('new inbox created')
    }
    console.log('inbox created')
    // Fetch the RecipeSeeker's name
    const recipeSeekerName = recipeSeeker.name;

    // Add the new message to the messages array with the author as the RecipeSeeker's name
    userNutritionistInbox.messages.push({
      message: messageContent,
      author: recipeSeekerName,
      time: new Date(),
    });
    console.log('Added messages to inbox')
    const savedUserNutritionistInbox = await userNutritionistInbox.save();

    // Create a notification for the Nutritionist
    const nutritionistNotification = new NutritionistNotification({
        sender: recipeSeeker._id,
        user: nutritionistId,
        type: 'Message by Recepie Seeker', 
        notification_text: `${recipeSeekerName} sent you a message.`,
        Time: new Date(),
      });
      console.log('Notifications saved')
      
      const savedNutritionistNotification = await nutritionistNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedUserNutritionistInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
