const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }, 
    nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' }, 
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    bmi: Number,
    calorieRange: {
      min: Number,
      max: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },seen: {
      type: Boolean,
      default: false,
    },
    amount:
    {
      type:Number,
      default:20
    }
  });
  
  const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
  
  module.exports = MealPlan;
  