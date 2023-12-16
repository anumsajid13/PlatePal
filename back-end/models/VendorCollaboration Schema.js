const mongoose = require('mongoose');
const Vendor = require('./Vendor Schema');
const Chef = require('./Chef Schema');
const Recipe = require('./Recipe Schema');
const Ingredient = require('./Ingredient Schema');

const vendorCollaborationSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],//why do we need this? we can get them from reciper
  Time: {
    type: Date,
    default: Date.now,
},
isAccepted: {
  type: String,
  default: "pendning",//accepted rejected
},
});

const VendorCollaboration = mongoose.model('VendorCollaboration', vendorCollaborationSchema);

module.exports = VendorCollaboration;
