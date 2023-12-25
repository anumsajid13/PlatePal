const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const UserChefInbox = require('../../models/User-Chef_Inbox Schema');
const Chef = require('../../models/Chef Schema');
const UserNotification = require('../../models/User_Notification Schema');

//route for a chef to send a message to a recipe seeker
router.post('/sendMessageToUser/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { messageContent } = req.body;

    //find the logged-in chef based on the token
    const chef = await Chef.findById(req.user.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    //find or create the User_Chef_Inbox document
    let userChefInbox = await UserChefInbox.findOne({ chef: req.user.id, user: userId });
    if (!userChefInbox) {
      userChefInbox = new UserChefInbox({
        chef: req.user.id,
        user: userId,
        messages: [],
      });
    }

    //fetch the chef's name
    const chefName = chef.name;

    //add the new message to the messages array with the author as the chef's name
    userChefInbox.messages.push({
      message: messageContent,
      author: chefName,
      time: new Date(),
    });

    //save the User_Chef_Inbox document
    const savedUserChefInbox = await userChefInbox.save();

    //create a notification for the Recipe Seeker
    const userNotification = new UserNotification({
      user: userId,
      type: `message`, 
      notification_text: `Chef ${chefName} sent you a message.`,
      Time: new Date(),
    });

    //save the UserNotification document
    const savedUserNotification = await userNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedUserChefInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
