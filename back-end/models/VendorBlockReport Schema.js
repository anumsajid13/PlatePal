const mongoose = require('mongoose');
const Vendor = require('../models/Vendor Schema');
const Chef = require('../models/Chef Schema');

const vendorBlockReportSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  reason: String,
  proof:{
    data: Buffer,
    contentType: String
  },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
});

const VendorBlockReport = mongoose.model('VendorBlockReport', vendorBlockReportSchema);

module.exports = VendorBlockReport;
