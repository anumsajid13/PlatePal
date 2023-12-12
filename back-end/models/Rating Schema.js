const mongoose = require('mongoose');
const RecipeSeeker = require('./RecipeSeekerSchema');
const Recipe = require('./Recipe Schema');

const ratingSchema = new mongoose.Schema({
  ratingNumber: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' },
  Time: {
    type: Date,
    default: Date.now,
},
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
