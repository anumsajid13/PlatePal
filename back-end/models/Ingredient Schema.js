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
  productImage: {    
    data: Buffer,
    contentType: String

    },

  quantity: {
    type: Number,
  },
  constituentsOf: {
    type: String,
    default: ' ',
  },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  Time: {
    type: Date,
    default: Date.now,
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
