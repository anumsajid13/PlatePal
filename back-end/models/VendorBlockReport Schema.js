const mongoose = require('mongoose');
const Vendor = require('./Vendor Schema');

const vendorBlockReportSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  reason: String,
});

const VendorBlockReport = mongoose.model('VendorBlockReport', vendorBlockReportSchema);

module.exports = VendorBlockReport;
