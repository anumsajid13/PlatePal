const mongoose = require('mongoose');
const Person = require('./Person Schema');


const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  Time: {
    type: Date,
    default: Date.now,
},
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
