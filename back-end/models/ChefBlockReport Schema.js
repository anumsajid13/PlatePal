const mongoose = require('mongoose');
const Chef = require('./Chef Schema');

const chefBlockReportSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  reason: String,
  proof: {
    type: Buffer,
    validate: {
      validator: function (v) {
        return /\.(pdf)$/.test(v);
      },
      message: props => `${props.value} is not a valid PDF file. Please use PDF.`,
    },
  },
});

const ChefBlockReport = mongoose.model('ChefBlockReport', chefBlockReportSchema);

module.exports = ChefBlockReport;
