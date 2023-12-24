const Nutritionist = require('../../models/Nutritionist Schema');
const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const autheticateToken = require('../../TokenAuthentication/token_authentication');
const express = require('express');
const router = express.Router();
// Endpoint to delete a nutritionist
router.delete('/delete-nutritionist/:nutritionistId',  autheticateToken, async (req, res) => {
    try {
      const nutritionist = await Nutritionist.findById(req.params.nutritionistId);
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      // Check block count and block if higher than 3
      if (nutritionist.blockCount > 3) {
         // Delete nutritionist's notifications (optional)
      await NutritionistNotification.deleteMany({ user: nutritionist._id });
  
      // Delete the nutritionist
      await nutritionist.remove();
  
      }
      
      return res.json({ message: 'Nutritionist deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Endpoint to delete a chef
router.delete('/delete-chef/:chefId',  autheticateToken, async (req, res) => {
    try {
      const chef = await Chef.findById(req.params.chefId);
      
      if (!chef) {
        return res.status(404).json({ error: 'Chef not found' });
      }
  
      if (chef.blockCount > 3) {

      // Delete chef's notifications (optional)
      await ChefNotification.deleteMany({ user: chef._id });
  
      // Delete the chef
      await chef.remove();
      }
  
      return res.json({ message: 'Chef deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Endpoint to delete a vendor
router.delete('/delete-vendor/:vendorId',  autheticateToken, async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.vendorId);
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
  
      // Delete vendor's notifications (optional)
      await Notification.deleteMany({ user: vendor._id });
  
      // Delete the vendor
      await vendor.remove();
  
      return res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = router;