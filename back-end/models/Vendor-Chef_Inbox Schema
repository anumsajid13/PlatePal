const mongoose = require('mongoose');
const Chef = require('./Chef Schema');
const Vendor = require('./Vendor Schema');

const Vendor_Chef_InboxSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  messages: [
    {
      message: String,
      author: String,
      time: Date,
    },
  ],
});

const Vendor_Chef_Inbox = mongoose.model('VendorInbox', Vendor_Chef_InboxSchema );

module.exports = Vendor_Chef_Inbox;
