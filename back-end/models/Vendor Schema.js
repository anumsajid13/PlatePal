const mongoose = require('mongoose');
const Person = require('./Notification Schema');
const Notification = require('./Notification Schema');

const vendorSchema = new mongoose.Schema({
  certificationImage: {
    type: Buffer,
    validate: {
      validator: function (v) {   
        return /\.(pdf)$/.test(v);
      },
      message: props => `${props.value} is not a valid image file. Please use PDF.`,
    },
  },
  isBlocked:{
    type: Boolean,
    default: false,
},
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
});

const Vendor =  Person.discriminator('Vendor', vendorSchema);

module.exports = Vendor;
