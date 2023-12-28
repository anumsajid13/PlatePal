const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const UserNutritionistInbox = require('../../models/User-Nutritionist_Inbox Schema'); // Assuming you have a model for User-Nutritionist Inbox
const Nutritionist = require('../../models/Nutritionist Schema'); // Assuming you have a model for Nutritionist
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const UserNotification = require('../../models/User_Notification Schema');

// Route for a nutritionist to send a message to a recipe seeker
router.post('/sendMessageToUserNutritionist/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { messageContent } = req.body;

    // Find the logged-in nutritionist based on the token
    const nutritionist = await Nutritionist.findById(req.user.id);
    if (!nutritionist) {
      return res.status(404).json({ message: 'Nutritionist not found' });
    }

    // Find or create the User_Nutritionist_Inbox document
    let userNutritionistInbox = await UserNutritionistInbox.findOne({ nutritionist: req.user.id, user: userId });
    if (!userNutritionistInbox) {
      userNutritionistInbox = new UserNutritionistInbox({
        nutritionist: req.user.id,
        user: userId,
        messages: [],
      });
    }

    // Fetch the nutritionist's name
    const nutritionistName = nutritionist.name;

    // Add the new message to the messages array with the author as the nutritionist's name
    userNutritionistInbox.messages.push({
      message: messageContent,
      author: nutritionistName,
      time: new Date(),
    });

    // Save the User_Nutritionist_Inbox document
    const savedUserNutritionistInbox = await userNutritionistInbox.save();

    // Create a notification for the Recipe Seeker
    const userNotification = new UserNotification({
      user: userId,
      type: `Message from Nutritionist`, 
      notification_text: `Nutritionist ${nutritionistName} sent you a message.`,
      Time: new Date(),
    });

    // Save the UserNotification document
    const savedUserNotification = await userNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedUserNutritionistInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Endpoint to get all nutritionists
router.get('/allNutritionists', async (req, res) => {
    try {
      const nutritionists = await RecipeSeeker.find({}, 'name _id'); 
  
      res.status(200).json(nutritionists);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  
  // Endpoint to get chat messages for a nutritionist
  router.get('/chatMessagesNutritionist/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
  
      const nutritionist = await Nutritionist.findById(req.user.id);
      if (!userId) {
        return res.status(404).json({ message: 'Nutritionist not found' });
      }
  
      // Find the User_Nutritionist_Inbox document for the specified user and nutritionist
      const userNutritionistInbox = await UserNutritionistInbox.findOne({ user: userId, nutritionist: nutritionist._id });
  
      if (!userNutritionistInbox) {
        return res.status(404).json({ message: 'UserNutritionistInbox not found' });
      }
  
      // Extract messages, author names, and times
      const chatMessages = userNutritionistInbox.messages.map((message) => ({
        _id: message._id,
        message: message.message,
        author: message.author,
        time: message.time,
      }));
  
      res.status(200).json({ messages: chatMessages });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });




module.exports = router;
