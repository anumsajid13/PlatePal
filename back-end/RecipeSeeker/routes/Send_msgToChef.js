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

  
    const recipeSeeker = await RecipeSeeker.findById(req.user.id);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

   
    let userChefInbox = await UserChefInbox.findOne({ chef: chefId, user: recipeSeeker._id });
    if (!userChefInbox) {
      userChefInbox = new UserChefInbox({
        chef: chefId,
        user: recipeSeeker._id,
        messages: [],
      });
    }

   
    const recipeSeekerName = recipeSeeker.name;

 
    userChefInbox.messages.push({
      message: messageContent,
      author: recipeSeekerName,
      time: new Date(),
    });

   
    const savedUserChefInbox = await userChefInbox.save();


    const chefNotification = new ChefNotification({
      
      user: chefId,
      type: 'message from recipe seeker',
      notification_text: `${recipeSeekerName} sent you a message.`,
      Time: new Date(),
    });

    const savedChefNotification = await chefNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedUserChefInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
