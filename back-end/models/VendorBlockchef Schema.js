const mongoose = require('mongoose');
const Chef = require('../models/Chef Schema');
const Vendor = require('../models/Vendor Schema');

const VendorBlocksChefSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // Fix: Change 'vendor' to 'Vendor'
  reason: String,
  proof: {
    data: Buffer,
    contentType: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },    
});

const VendorBlocksChef = mongoose.model('VendorBlocksChef', VendorBlocksChefSchema);

module.exports = VendorBlocksChef; 
