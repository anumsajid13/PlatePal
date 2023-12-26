const express = require('express');
const router = express.Router();
const VendorNotification = require('../../models/Vendor_Notification Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

// Endpoint to get paginated, filtered, and sorted unread notifications for a vendor
router.get('/', authenticateToken, async (req, res) => {
    try {
     
      const {  sortBy, sortOrder, type } = req.query;
  
      const sortOptions = {};
      if (sortBy) {
        let sortvalue;
        if (!sortOrder || sortOrder === 'newest') {
          sortvalue = -1; // Newest first (descending order)
        } else if (sortOrder === 'oldest') {
          sortvalue = 1; // Oldest first (ascending order)
        }
        sortOptions[sortBy] = sortvalue;
      }
  
      const filterQuery = { vendor: req.user.id , read: false  }; // Filter unread notifications for the vendor
      if (type) {
        filterQuery.type = type;
      }
  
      const notifications = await VendorNotification.find(filterQuery) .sort(sortOptions);
      
  
      if (notifications.length === 0) {
        return res.status(404).json({ message: 'No unread notifications found for the vendor' });
      }
  
    
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  // Endpoint to mark a notification as read
router.post('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;
    const notificationId = req.params.notificationId;

    // Find the notification by ID for the given vendor
    const notification = await VendorNotification.findOne({
      _id: notificationId,
      vendor: vendorId,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found for the vendor' });
    }

    // Update the notification to mark it as read
    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
