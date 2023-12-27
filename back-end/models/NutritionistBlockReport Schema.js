const mongoose = require('mongoose');
const Nutritionist = require('./Nutritionist Schema');
const RecipeSeeker = require('./RecipeSeekerSchema');

const nutritionistBlockReportSchema = new mongoose.Schema({
  nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' },
  recipeSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }, // Add this field
  reason: String,
  proof:{
    data: Buffer,
    contentType: String
  },
});

const NutritionistBlockReport = mongoose.model('NutritionistBlockReport', nutritionistBlockReportSchema);

module.exports = NutritionistBlockReport;
