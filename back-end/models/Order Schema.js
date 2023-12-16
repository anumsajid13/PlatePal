const mongoose = require('mongoose');
const Recipe = require('./Recipe Schema');

const orderSchema = new mongoose.Schema({
  items: [
    {
      recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      servingSize: Number,
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

const cartSchema = new mongoose.Schema({
  recipeSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker', required: true },
  orders: [Order.schema], // Assuming Order is a mongoose model
  totalAmount: { type: Number, required: true },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
