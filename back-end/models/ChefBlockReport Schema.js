const mongoose = require('mongoose');
const Chef = require('./Chef Schema');

const chefBlockReportSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  reason: String,
});

const ChefBlockReport = mongoose.model('ChefBlockReport', chefBlockReportSchema);

module.exports = ChefBlockReport;
