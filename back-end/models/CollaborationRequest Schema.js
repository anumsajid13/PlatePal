const mongoose = require('mongoose');
const Chef = require('./Chef Schema');
const Vendor = require('./Vendor Schema');
const Recipe = require('./Recipe Schema');

const collaborationRequestSchema = new mongoose.Schema({
  acceptanceStatus:Boolean,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  ingredients: [
    {
      name: { type: String, required: true },
    }
  ],
  isAccepted: {
    type: String,
    default: "pending",//accepted rejected
  },
  Time: {
    type: Date,
    default: Date.now,
}
});

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);

module.exports = CollaborationRequest;
