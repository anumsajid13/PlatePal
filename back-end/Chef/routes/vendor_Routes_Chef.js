const express = require('express');
const router = express.Router();
const Vendor = require('../../models/Vendor Schema');
const Ingredient = require('../../models/Ingredient Schema');

//get all the vendors
router.get('/vendors', async (req, res) => {
    try {
      const unblockedVendors = await Vendor.find({ isBlocked: false });
      res.status(200).json(unblockedVendors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

//get the ingredients for every vendor
router.get('/vendors-with-ingredients', async (req, res) => {
  try {
    const vendors = await Vendor.find({}, 'name profilePicture'); // Get all vendors with limited fields

    const vendorsWithIngredients = [];

    for (const vendor of vendors) {
      const ingredients = await Ingredient.find({ vendor: vendor._id }); // Find ingredients for each vendor

      // Populate the vendor's image field if available
      const populatedVendor = await Vendor.populate(vendor, { path: 'profilePicture' });

      const vendorWithBase64Image = {
        ...populatedVendor._doc,
        profilePicture: populatedVendor.profilePicture
          ? {
              data: populatedVendor.profilePicture.data.toString('base64'),
              contentType: populatedVendor.profilePicture.contentType,
            }
          : { data: '', contentType: '' }, // No image found for this vendor
        ingredients: ingredients,
      };

      vendorsWithIngredients.push(vendorWithBase64Image);
    }

    res.status(200).json(vendorsWithIngredients);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
})
  
module.exports = router;