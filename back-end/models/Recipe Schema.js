const mongoose = require('mongoose');
const Rating = require('./Rating Schema');
const Comment = require('./Comment Schema');
const Chef = require('./Chef Schema');
const Vendor = require('./Vendor Schema');

const recipeSchema = new mongoose.Schema({
  title: String,
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  calories: Number,
  servingSize: Number,
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  difficulty: String,
  totalTime: Number,
  category: [String],
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  instructions: [String],
  allergens: [String],
  notDelivered: [String],
  utensils: [String],
  recipeImage:{
    data: Buffer,
    contentType: String
  },
  isBlocked:{
    type: Boolean,
    default: false,
  },
  postedAt:{
    type: Date,
    default: Date.now,
  },
  description: String,
  Nutrients:[{
    nutrientName: String,
    value: Number,
    unitName: String,
  }],
  price:Number,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
