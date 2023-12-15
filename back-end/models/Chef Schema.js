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
      data: Buffer,
      contentType: String

      },

  certificationImage:{
    data: Buffer,
    contentType: String
  },
  allowSignup: {
    type: Boolean,
    default: false,
  },
  
  isBlocked:{
    type: Boolean,
    default: false,
},blockCount: {
  type: Number,
  default: 0,
}, unblockTime: {
  type: Date,
  default: null, // Initially set to null, indicating not blocked
},

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef_Notification' }],
});

const Chef =   mongoose.model('Chef', chefSchema);

module.exports = Chef;
