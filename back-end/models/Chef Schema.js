const mongoose = require('mongoose');




const chefSchema = new mongoose.Schema({

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
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef_Notification' }],
});

const Chef =   mongoose.model('Chef', chefSchema);

module.exports = Chef;