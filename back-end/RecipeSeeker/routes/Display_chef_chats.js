// routes/recepieSeeker.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const UserChefInbox = require('../../models/User-Chef_Inbox Schema');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Chef = require('../../models/Chef Schema');

router.get('/chatMessages/:chefId', authenticateToken, async (req, res) => {
  try {
    const { chefId } = req.params;

    const recipeSeeker = await RecipeSeeker.findById(req.user.id);
    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Find the User_Chef_Inbox document for the specified chef and user
    const userChefInbox = await UserChefInbox.findOne({ chef: chefId, user: recipeSeeker._id });

    if (!userChefInbox) {
      return res.status(404).json({ message: 'UserChefInbox not found' });
    }

    // Extract messages, author names, and times
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
