const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const VendorReview = require('../../models/VendorReview Schema'); 

// Route to get reviews of the logged-in vendor
router.get('/', authenticateToken, async (req, res) => {
  try {
    const loggedInVendorId = req.user.id;

    // Find reviews of the logged-in vendor
    const vendorReviews = await VendorReview.find({ vendor: loggedInVendorId })
      .populate({
        path: 'user',
        select: 'name profilePicture', 
      })
      .select('Review Time isPinned user vendor');

    // Separate pinned and unpinned reviews
    const pinnedReviews = [];
    const unpinnedReviews = [];
    vendorReviews.forEach(review => {
      const reviewData = {
        _id: review._id,
        Review: review.Review,
        Time: review.Time,
        isPinned: review.isPinned,
        user: {
          _id: review.user._id,
          name: review.user.name,
          profilePicture: review.user.profilePicture
            ? `data:${review.user.profilePicture.contentType};base64,${review.user.profilePicture.data.toString('base64')}`
            : null,
        },
      };
      if (review.isPinned) {
        pinnedReviews.push(reviewData);
      } else {
        unpinnedReviews.push(reviewData);
      }
    });

    // Concatenate pinned reviews on top of unpinned reviews
    const sortedReviews = [...pinnedReviews, ...unpinnedReviews];

    res.status(200).json({ vendorReviews: sortedReviews });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Pin vendor reviews
router.put('/pinReview/:reviewId', authenticateToken, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    // Finding the review by ID
    const review = await VendorReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Vendor review not found' });
    }

    // Updating the review to set it as pinned
    review.isPinned = true; 

    await review.save();

    res.status(200).json({ message: 'Vendor review pinned successfully', review: review });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Unpin vendor reviews
router.put('/unpinReview/:reviewId', authenticateToken, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    // Finding the review by ID
    const review = await VendorReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Vendor review not found' });
    }

    // Updating the review to set it as unpinned
    review.isPinned = false;

    await review.save();

    res.status(200).json({ message: 'Vendor review unpinned successfully', review: review });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
