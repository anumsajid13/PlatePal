/* const express = require('express');
const router = express.Router();
const VendorChefInbox = require('../../models/Vendor-Chef_Inbox Schema');
const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const VendorNotification = require('../../models/Vendor_Notification Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

router.post('/rateVendor/:vendorId', authenticateToken, async (req, res) => {
    const { ratingNumber } = req.body;
    const { vendorId } = req.params;
    const userId = req.user.id;
  
    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      // Check if the user has already rated the recipe
      const existingRating = await Rating.findOne({ user: userId, recipe: recipeId });
  
      if (existingRating) {
        // Update existing rating
        existingRating.ratingNumber = ratingNumber;
        await existingRating.save();
      } else {
        // Create a new rating
        const newRating = new Rating({
          ratingNumber,
          user: userId,
          recipe: recipeId,
        });
  
        await newRating.save();
        recipe.ratings.push(newRating);
        await recipe.save();

        // Remove any old ratings associated with the user and recipe
        await Rating.deleteMany({ user: userId, recipe: recipeId, _id: { $ne: newRating._id } });
      }
  
      res.status(201).json({ message: 'Recipe rated successfully' });
    } catch (error) {
      console.error('Error rating recipe:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
 */