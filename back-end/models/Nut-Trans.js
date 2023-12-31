const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NutTransSchema= new Schema({
  NutId: {
    type: Schema.Types.ObjectId,
    ref: 'Nutritionist', 
    required: true,
  },

  sender:
  {
    type: Schema.Types.ObjectId,
    ref: 'RecipeSeeker', 
    required: true,
  },
  mealPlan: [
    {
      PlanId: {
        type: Schema.Types.ObjectId,
        ref: 'MealPlan', 
        required: true,
      },
     
    },
  ],
  Paid: {
    type: Number,
    required: true,
    default:0
  },
});

const Transaction = mongoose.model('Nut-trans', NutTransSchema);

module.exports = Transaction;
