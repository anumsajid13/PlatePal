const mongoose = require('mongoose');
const Nutritionist = require('./Nutritionist Schema');

const nutritionistBlockReportSchema = new mongoose.Schema({
  nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' },
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

const NutritionistBlockReport = mongoose.model('NutritionistBlockReport', nutritionistBlockReportSchema);

module.exports = NutritionistBlockReport;
