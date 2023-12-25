const mongoose = require('mongoose');
const Order = require('./Order Schema');

const cartSchema = new mongoose.Schema({
  recipeSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker', required: true },
  orders: [Order.schema],
  totalAmount: { type: Number, required: true },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;