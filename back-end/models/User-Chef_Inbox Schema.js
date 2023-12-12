const mongoose = require('mongoose');
const Chef = require('./Chef Schema');
const RecipeSeeker = require('./RecipeSeekerSchema');

const User_Chef_InboxSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' },
  messages: [
    {
      message: String,
      author: String,
      time: Date,
    },
    {
      
    }
  ],
});

const User_Chef_Inbox = mongoose.model('UserInbox', User_Chef_InboxSchema);

module.exports = User_Chef_Inbox;
