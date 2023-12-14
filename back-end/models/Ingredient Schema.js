const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  constituentsOf: {
    type: String,
    default: null,
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
