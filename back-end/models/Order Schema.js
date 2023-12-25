const mongoose = require('mongoose');
const Recipe = require('./Recipe Schema');


const orderSchema = new mongoose.Schema({
  items: [
    {
      recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      name:String,
      price:Number,
      quantity: Number,
      chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;


