const express = require('express');
const router = express.Router();
const Chef=require('../../models/Chef Schema');
const VendorReview = require('../../models/VendorReview Schema');
const Vendor = require('../../models/Vendor Schema');
const VendorNotification = require('../../models/Vendor_Notification Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

// Endpoint for a Chef to give a review
router.post('/writeReview',authenticateToken, async (req, res) => {
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

    await vendorNotification.save();
  
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//endpoint to get reviews of a particular vendor
router.get('/reviews/:vendorId', authenticateToken,  async (req, res) => {
  try {
      const vendorId = req.params.vendorId;

      //fetch all reviews for the specified vendor and populate chef details
      const reviews = await VendorReview.find({ vendor: vendorId })
          .populate({
              path: 'user',
              model: 'Chef',
              select: 'name profilePicture', //select specific fields from Chef model
          })
          .sort({ Time: -1 }) //sort by Time in descending order (newest first)

          if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the vendor' });
          }
      
          const updatedReviews = reviews.map((review) => ({
            reviewText: review.Review,
            user: {
              name: review.user.name,
              _id: review.user._id,
              profilePicture: review.user.profilePicture
                ? `data:${review.user.profilePicture.contentType};base64,${review.user.profilePicture.data.toString('base64')}`
                : null,
            },
            time: review.Time,
          }));
      

      res.json(updatedReviews);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch vendor reviews' });
  }
});

module.exports = router;