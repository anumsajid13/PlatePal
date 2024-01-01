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
    unblockTime: {
      type: Date,
      default: null, // Initially set to null, indicating not blocked
    }, description: {
      type: String, // Add description field
      default: '', // Set a default value if needed
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSeeker' }],
    
      notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'nutritionist_Notification' }],
      profilePicture: {    
        data: Buffer,
        contentType: String
  
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
}, blockCount: {
  type: Number,
  default: 0,
},
balance: {
  type: Number,
  default: 0,
}


});

const Nutritionist =  mongoose.model('Nutritionist', nutritionistSchema);

module.exports = Nutritionist;
