const mongoose = require('mongoose');


const Vendor_notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  Time: {
    type: Date,
    default: Date.now,
},
type: {
  type: String, 
  required: true,
}
});

const Vendor_Notification = mongoose.model('Vendor_Notification',Vendor_notificationSchema);

module.exports = Vendor_Notification;
