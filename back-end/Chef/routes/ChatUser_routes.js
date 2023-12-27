const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const UserChefInbox = require('../../models/User-Chef_Inbox Schema');
const Chef = require('../../models/Chef Schema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
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


router.get('/allUsers', async (req, res) => {
  try {
    const users = await RecipeSeeker.find({}, 'name profilePicture');

    const usersWithBase64Image = users.map(user => {
      if (user.profilePicture && user.profilePicture.data && user.profilePicture.contentType) {
        try {
          const base64ImageData = user.profilePicture.data.toString('base64');
          return {
            ...user._doc,
            profilePicture: { data: base64ImageData, contentType: user.profilePicture.contentType },
           
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
          return {
            ...user._doc,
            profilePicture: { data: '', contentType: user.profilePicture.contentType }, 
            
          };
        }
      } else {
       
        return {
          ...user._doc,
          profilePicture: { data: '', contentType: '' }, 
          
        };
      }
    });
    
   
    //console.log("hahhaha",topChefsWithBase64Image)
    return res.json( usersWithBase64Image);

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/chatMessages/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const chef = await Chef.findById(req.user.id);
    if (!userId) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    //find the User_Chef_Inbox document for the specified chef and user
    const userChefInbox = await UserChefInbox.findOne({ user: userId, chef: chef._id });

    if (!userChefInbox) {
      return res.status(404).json({ message: 'UserChefInbox not found' });
    }

    //Extract messages, author names, and times
    const chatMessages = userChefInbox.messages.map((message) => ({
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
