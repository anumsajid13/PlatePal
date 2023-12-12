const mongoose = require('mongoose');
const RecipeSeeker = require('./RecipeSeekerSchema');
const Notification = require('./Notification Schema');
const Person = require('./Person Schema');



const chefSchema = new mongoose.Schema({
  certificationImage:{
    type: Buffer,
    validate: {
      validator: function (v) {   
        return /\.(pdf)$/.test(v);
      },
      message: props => `${props.value} is not a valid image file. Please use PNG, JPG, or JPEG.`,
    },
  },

  isBlocked:{
    type: Boolean,
    default: false,
},

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
});

const Chef =  Person.discriminator('Chef', chefSchema);

module.exports = Chef;
