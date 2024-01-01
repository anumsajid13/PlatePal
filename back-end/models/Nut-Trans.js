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

  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],

  Paid: {
    type: Number,
    required: true,
    default:0
  },
});

const NTransaction = mongoose.model('Nut-trans', NutTransSchema);

module.exports = NTransaction;
