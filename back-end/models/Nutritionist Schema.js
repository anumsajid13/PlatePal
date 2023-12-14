const mongoose = require('mongoose');
const Notification = require('./User_Notification Schema');

const nutritionistSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
      username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    
    profilePicture: {
        type: Buffer,
        validate: {
          validator: function (v) {   
            return /\.(png|jpg|jpeg)$/.test(v);
          },
          message: props => `${props.value} is not a valid image file. Please use PNG, JPG, or JPEG.`,
        },
      },
      address: String,

  certificationPictures: {
    type: Buffer,
    validate: {
      validator: function (v) {   
        return /\.(pdf)$/.test(v);
      },
      message: props => `${props.value} is not a valid image file. Please use pdf.`,
    },
  },
  isBlocked:{
    type: Boolean,
    default: false,
}, blockCount: {
  type: Number,
  default: 0,
}, unblockTime: {
  type: Date,
  default: null, // Initially set to null, indicating not blocked
},
followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }],

  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'nutritionist_Notification' }],
});

const Nutritionist =  mongoose.model('Nutritionist', nutritionistSchema);

module.exports = Nutritionist;
