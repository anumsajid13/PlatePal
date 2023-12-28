const express = require('express');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const User_Notification = require('../../models/User_Notification Schema');
const router = express.Router();

router.get('/notifications/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await User_Notification.find({
      user: userId
    })
    .sort({ Time: -1 }) 
    .exec();

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.delete('/deletenotifications/:id', authenticateToken, async (req, res) => {
  try {
      const notificationId = req.params.id;
      const userId = req.user.id;


      console.log("userId: ",userId )
      console.log("notification id: ",notificationId )
      const notification = await User_Notification.findOne({
          _id: notificationId,
          user: userId
      });

      if (!notification) {
          return res.status(404).json({ message: 'Notification not found' });
      }

      await User_Notification.findByIdAndDelete(notificationId);

      res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});




module.exports = router;
