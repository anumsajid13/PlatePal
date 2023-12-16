const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const UserChefInbox = require('../../models/User-Chef_Inbox Schema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Chef = require('../../models/Chef Schema');
const ChefNotification = require('../../models/Chef_Notification Schema');

// Route for a RecipeSeeker to send a message to a Chef
router.post('/sendMessageToChef/:chefId', authenticateToken, async (req, res) => {
  try {
    const { chefId } = req.params;
    const { messageContent } = req.body;

    // Find the logged-in RecipeSeeker based on the token
    const recipeSeeker = await RecipeSeeker.findById(req.user.userId);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Find or create the User_Chef_Inbox document
    let userChefInbox = await UserChefInbox.findOne({ chef: chefId, user: recipeSeeker._id });
    if (!userChefInbox) {
      userChefInbox = new UserChefInbox({
        chef: chefId,
        user: recipeSeeker._id,
        messages: [],
      });
    }

    // Fetch the RecipeSeeker's name
    const recipeSeekerName = recipeSeeker.name;

    // Add the new message to the messages array with the author as the RecipeSeeker's name
    userChefInbox.messages.push({
      message: messageContent,
      author: recipeSeekerName,
      time: new Date(),
    });

    // Save the User_Chef_Inbox document
    const savedUserChefInbox = await userChefInbox.save();

    // Create a notification for the Chef
    const chefNotification = new ChefNotification({
      chef: chefId,
      user: recipeSeeker._id,
      type: 'message', // Adjust the notification type as needed
      notification_text: `${recipeSeekerName} sent you a message.`,
      Time: new Date(),
    });

    // Save the ChefNotification document
    const savedChefNotification = await chefNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedUserChefInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
