const AdminNotification = require('../../models/Admin_Notification Schema');
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Vendor = require('../../models/Vendor Schema'); // Replace with the actual path to your Vendor model
const Nutritionist = require('../../models/Nutritionist Schema'); // Replace with the actual path to your Nutritionist model
const Chef = require('../../models/Chef Schema'); // Replace with the actual path to your Chef model

// Endpoint to retrieve notifications with sender details

// Endpoint to retrieve notifications with sender details
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .populate({
        path: 'sender',
        options: { strictPopulate: false },
      })
      .populate({
        path: 'sender.senderType',
        select: 'username', // Adjust this based on the actual fields in your senderType models
      })
      .exec();

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;