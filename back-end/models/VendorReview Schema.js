const mongoose = require('mongoose');
const Vendor = require('../models/Vendor Schema');
const Chef = require('../models/Chef Schema');  

const VendorReviewSchema = new mongoose.Schema({
  Review: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  Time: {
    type: Date,
    default: Date.now,
},
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isPinned:{
    type: Boolean,
    default: false,
  },
});

const vendorReview = mongoose.model('vendorReview', VendorReviewSchema);

module.exports = vendorReview;
