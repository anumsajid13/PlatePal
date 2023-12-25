const mongoose = require('mongoose');
const Notification = require('./User_Notification Schema');

const vendorSchema = new mongoose.Schema({

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
CollaborationNum: {
  type: Number,
  default: 0,
},
});

const Vendor =   mongoose.model('Vendor', vendorSchema);

module.exports =  Vendor;
