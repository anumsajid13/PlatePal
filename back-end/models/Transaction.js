const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  recipeseekerId: {
    type: Schema.Types.ObjectId,
    ref: 'RecipeSeeker', 
    required: true,
  },
  recipes: [
    {
      recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe', 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  checkoutDate: {
    type: Date,
    default: Date.now,
  },
 

  isDelivered: {
    type: Boolean,
    default: false,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
