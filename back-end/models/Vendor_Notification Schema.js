const mongoose = require('mongoose');


const Vendor_notificationSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  chef:{type:mongoose.Schema.Types.ObjectId,ref:'Chef'},
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

const Vendor_Notification = mongoose.model('Vendor_Notification',Vendor_notificationSchema);

module.exports = Vendor_Notification;
