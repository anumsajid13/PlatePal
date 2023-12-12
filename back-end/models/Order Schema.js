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
