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

/*router.get('/allUsers', async (req, res) => {
  try {
    const userss = await RecipeSeeker.find({}, 'name profilePicture');

    const usersWithBase64Image = userss.map((users) => {
      if (users.profilePicture !== undefined || users.profilePicture !== null) {
        if (typeof users.profilePicture === 'object') {
          const base64String = Buffer.from(users.profilePicture.data.buffer).toString('base64');
          return {
            _id: users._id,
            name: users.name,
            profilePicture: `data:${users.profilePicture.contentType};base64,${base64String}`,
          };
        } else {
          return {
            _id: users._id,
            name: users.name,
            profilePicture: users.profilePicture.toString('base64'),
          };
        }
      } else {
        console.log(`Profile picture is undefined or null for user with ID: ${users._id}`);
        return {
          _id: users._id,
          name: users.name,
          profilePicture: null,
        };
      }
    });

    res.status(200).json({ users: usersWithBase64Image });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});*/

router.get('/allUsers', async (req, res) => {
  try {
    const users = await RecipeSeeker.find({}, 'name');

    const names = users.map(user => user.name);

    res.status(200).json({ names });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;
