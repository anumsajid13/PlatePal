const mongoose = require('mongoose');
const RecipeSeeker = require('./RecipeSeekerSchema');
const Nutritionist = require('./Nutritionist Schema');

const User_Nutritionist_InboxSchema = new mongoose.Schema({
  nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' },
  messages: [
    {
      message: String,
      author: String,
      time: Date,
    },
  ],
});

const User_Nutritionist_Inbox = mongoose.model('NutritionistInbox', User_Nutritionist_InboxSchema);

module.exports = User_Nutritionist_Inbox;
