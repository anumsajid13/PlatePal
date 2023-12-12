const Recipe = require('./Recipe Schema');
const Chef = require('./Chef Schema');
const Notification = require('./Notification Schema');
const Person = require('./Person Schema');
const mongoose = require('mongoose');

const recipeSeekerSchema = new mongoose.Schema({
  creditCardInfo: String,
  recipeBookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
});

const RecipeSeeker =  Person.discriminator('RecipeSeeker', recipeSeekerSchema);

module.exports = RecipeSeeker;
