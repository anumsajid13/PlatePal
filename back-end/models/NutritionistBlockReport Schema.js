const mongoose = require('mongoose');
const Nutritionist = require('./Nutritionist Schema');

const nutritionistBlockReportSchema = new mongoose.Schema({
  nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' },
  reason: String,
});

const NutritionistBlockReport = mongoose.model('NutritionistBlockReport', nutritionistBlockReportSchema);

module.exports = NutritionistBlockReport;
