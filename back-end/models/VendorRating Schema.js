const mongoose = require('mongoose');
const Vendor = require('../models/Vendor Schema');
const Chef = require('../models/Chef Schema');  

const vendorRatingSchema = new mongoose.Schema({
  ratingNumber: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  Time: {
    type: Date,
    default: Date.now,
},
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
});

const vendorRating = mongoose.model('vendorRating', vendorRatingSchema);

module.exports = vendorRating;
