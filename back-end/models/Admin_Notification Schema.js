const mongoose = require('mongoose');

const admin_notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  Time: {
    type: Date,
    default: Date.now,
},
type: {
  type: String, 
  required: true,
}
,
notification_text:
{
  type :String
}
});

const admin_Notification = mongoose.model('admin_Notification', admin_notificationSchema);

module.exports = admin_Notification;
