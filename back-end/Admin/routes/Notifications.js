
const AdminNotification = require('../../models/Admin_Notification Schema');
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');


// Endpoint to retrieve notifications with sender details
router.get('/notifications',authenticateToken, async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .populate({
        path: 'sender',
        model: function(doc) {
          // Determine the model dynamically based on senderType
          switch (doc.senderType) {
            case 'Vendor':
              return '';
            case 'Nutritionist':
              return 'Nutritionist';
            case 'Chef':
              return 'Chef';
            default:
              return 'User'; // Replace with the default user model name
          }
        },
        select: 'username', // Replace with the field you want to select
      })
      .exec();

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
