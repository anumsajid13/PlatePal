const express = require('express');
const router = express.Router();
const VendorNotification = require('../models/Vendor_Notification');
const authenticateToken = require('../TokenAuthentication/token_authenticate');

// Endpoint to get paginated, filtered, and sorted notifications for a vendor
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.vendorId; 
      const { page = 1, limit = 30, sortBy,sortOrder, chefId, type } = req.query;
  
      
    const sortOptions = {};
    if(!sortBy)
    {
    sortOptions[sortBy]=1;
    }
    if (sortBy && sortBy=='time') {
      let sortvalue;
      if (!sortOrder) {
        sortvalue = 1;//asc default
      } else if (sortOrder === 'oldest') {
        sortvalue = -1;//desc
      } else {
        sortvalue = 1;//sortorder=='newest' 
      }
      sortOptions[sortBy] = sortvalue; 
    } 
  
      const filterQuery = { user: vendorId };
      if (chefId) {
        filterQuery.chefId = chefId;
      }
      if (type) {
        filterQuery.type = type;
      }
  
      const notifications = await VendorNotification.find(filterQuery)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit))

  
      if (notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found for the vendor' });
      }
      const notificationNo = await VendorNotification.find(query).countDocuments(); //total no. of notifications in db
      const totalPages = Math.ceil(notificationNo / limit); //total no. of pages
      res.status(200).json({ notifications, totalPages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  // Endpoint to mark a notification as read or delete it
  module.exports = router;