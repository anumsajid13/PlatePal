const mongoose = require('mongoose');


const nutritionist_notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' },
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

const nutritionist_Notification = mongoose.model('nutritionist_Notification', nutritionist_notificationSchema);

module.exports = nutritionist_Notification;
