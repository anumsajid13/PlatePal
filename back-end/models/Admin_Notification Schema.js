const mongoose = require('mongoose');

const admin_notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderType'
  },
  senderType: {
    type: String,
    enum: ['Vendor', 'Nutritionist', 'Chef']
  },
  time: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  notification_text: {
    type: String
  }
});

const admin_Notification = mongoose.model('admin_Notification', admin_notificationSchema);

module.exports = admin_Notification;
