const mongoose = require('mongoose');
const RecipeSeeker = require('./RecipeSeekerSchema');
const Recipe = require('./Recipe Schema');

const ReviewSchema = new mongoose.Schema({
  Review: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' },
  Time: {
    type: Date,
    default: Date.now,
},
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
