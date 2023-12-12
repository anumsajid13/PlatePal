const mongoose = require('mongoose');
const Person = require('./Person Schema');
const Notification = require('./Notification Schema');

const adminSchema = new mongoose.Schema({
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
});

const Admin =  Person.discriminator('Admin', adminSchema);

module.exports = Admin;
