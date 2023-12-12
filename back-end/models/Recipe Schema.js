const mongoose = require('mongoose');
const Rating = require('./Rating Schema');
const Comment = require('./Comment Schema');
const Chef = require('./Chef Schema');

const recipeSchema = new mongoose.Schema({
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  calories: Number,
  servingSize: Number,
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
