const mongoose = require('mongoose');
const Person = require('./Person Schema');
const Notification = require('./Notification Schema');

const nutritionistSchema = new mongoose.Schema({
  certificationPictures: {
    type: Buffer,
    validate: {
      validator: function (v) {   
        return /\.(png|jpg|jpeg)$/.test(v);
      },
      message: props => `${props.value} is not a valid image file. Please use PNG, JPG, or JPEG.`,
    },
  },
  isBlocked:{
    type: Boolean,
    default: false,
},
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
});

const Nutritionist =  Person.discriminator('Nutritionist', nutritionistSchema);

module.exports = Nutritionist;
