const mongoose = require('mongoose');
const RecipeSeeker = require('./RecipeSeekerSchema');


const User_notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' },
  Time: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String, 
    required: true,
  },
  notification_text:
  {
    type :String
  }
});

const User_Notification = mongoose.model('User_Notification', User_notificationSchema );

module.exports = User_Notification;
