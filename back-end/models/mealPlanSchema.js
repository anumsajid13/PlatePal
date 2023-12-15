const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }, // Assuming RecipeSeeker is the user model
    nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' }, // Assuming Nutritionist is the nutritionist model
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    bmi: Number,
    calorieRange: {
      min: Number,
      max: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
  
  module.exports = MealPlan;
  