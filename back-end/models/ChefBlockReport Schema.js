const mongoose = require('mongoose');
const Chef = require('./Chef Schema');
const RecipeSeeker = require('./RecipeSeekerSchema'); // Add this line

const chefBlockReportSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  recipeSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }, // Add this field
  reason: String,
  proof: {
    data: Buffer,
    contentType: String
  },
});

const ChefBlockReport = mongoose.model('ChefBlockReport', chefBlockReportSchema);

module.exports = ChefBlockReport;
