const mongoose = require('mongoose');
const RecipeSeeker = require('./RecipeSeekerSchema');
const Recipe = require('./Recipe Schema');

const commentSchema = new mongoose.Schema({
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' },
  Time: {
    type: Date,
    default: Date.now,
},
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
