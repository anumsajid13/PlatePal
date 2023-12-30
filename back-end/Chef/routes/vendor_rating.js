const express = require('express');
const router = express.Router();
const VendorRating = require('../../models/VendorRating Schema'); 
const Vendor = require('../../models/Vendor Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

router.post('/rateVendor/:vendorId', authenticateToken, async (req, res) => {
    const { ratingNumber } = req.body;
    const { vendorId } = req.params;
    const userId = req.user.id;

    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Check if the user has already rated the vendor
        const existingRating = await VendorRating.findOne({ user: userId, vendor: vendorId });

        if (existingRating) {
            // Update existing rating
            existingRating.ratingNumber = ratingNumber;
            await existingRating.save();
        } else {
            // Create a new rating
            const newRating = new VendorRating({
                ratingNumber,
                user: userId,
                vendor: vendorId,
            });

            await newRating.save();
            vendor.ratings.push(newRating);
            await vendor.save();

            // Remove any old ratings associated with the user and vendor
            await VendorRating.deleteMany({ user: userId, vendor: vendorId, _id: { $ne: newRating._id } });
        }

        res.status(201).json({ message: 'Vendor rated successfully' });
    } catch (error) {
        console.error('Error rating vendor:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
