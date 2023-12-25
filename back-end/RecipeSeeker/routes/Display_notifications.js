const express = require('express');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const User_Notification = require('../../models/User_Notification Schema');
const router = express.Router();

router.get('/notifications/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await User_Notification.find()
      .sort({ Time: -1 }) 
      .exec();

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
