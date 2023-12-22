const Recipe = require('./Recipe Schema');
const Chef = require('./Chef Schema');
const Notification = require('./User_Notification Schema');
const mongoose = require('mongoose');

const recipeSeekerSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  username: {
      type: String,
      required: true,
      unique: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true,
  },
  profilePicture: {
    data: Buffer,
    contentType: String
  },
  address: String,
  creditCardInfo: String,
  recipeBookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User_Notification' }],
});

const RecipeSeeker = mongoose.model('RecipeSeeker', recipeSeekerSchema);

module.exports = RecipeSeeker;