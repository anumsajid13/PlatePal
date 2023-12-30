const express = require('express');
const router = express.Router();
const Chef=require('../../models/Chef Schema');
const VendorReview = require('../../models/VendorReview Schema');
const Vendor = require('../../models/Vendor Schema');
const VendorNotification = require('../../models/Vendor_Notification Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

// Endpoint for a Chef to give a review
router.post('/chef/review',authenticateToken, async (req, res) => {
  try {

    const chefId = req.user.id; 
    const vendorId = req.body.vendorId; 
    const reviewText = req.body.reviewText;

    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    const newReview = new VendorReview({
      Review: reviewText,
      user: chefId,
      vendor: vendorId,
    });

    await newReview.save();
     const vendorNotification = new VendorNotification({
        vendor: vendorId,
        chef: req.user.id,
        type: `review`, 
        notification_text: `Chef ${chef.name} added a review.`,
        Time: new Date(),
      });
  
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;