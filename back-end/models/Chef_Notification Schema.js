const mongoose = require('mongoose');


const chef_notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  Time: {
    type: Date,
    default: Date.now,
},
type: {
  type: String, 
  required: true,
},
notification_text:
{
  type :String
}
});

const Chef_Notification = mongoose.model('Notification', chef_notificationSchema);

module.exports = Chef_Notification;
