const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday", "Tuesday", etc.
  meals: [
    {
      type: { type: String, required: true }, // e.g., "Breakfast", "Lunch", "Dinner"
      description: { type: String, required: true },
      calories: { type: Number, required: true },
    },
  ],
});

const userProfileSchema = new mongoose.Schema({
  recipeSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker', required: true },
  nutritionistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist', required: true },
  bmi: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  height: { type: Number, required: true },
  mealPlans: [mealPlanSchema],
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
