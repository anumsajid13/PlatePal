const Nutritionist = require('../../models/Nutritionist Schema');
const Admin = require('../../models/Admin Schema');
const admin_Notification = require('../../models/Admin_Notification Schema');
const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const ChefNotification = require('../../models/Chef_Notification Schema');
const NutritionistBlockReport= require ('../../models/NutritionistBlockReport Schema');
const ChefBlockReport = require('../../models/ChefBlockReport Schema');
const VendorBlockReport = require('../../models/VendorBlockReport Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const express = require('express');
const router = express.Router();
const VendorNotification = require('../../models/Vendor_Notification Schema');


// Endpoint to block a chef based on a report
router.post('/block-chef/:chefId', authenticateToken, async (req, res) => {
  try {
      const chef = await Chef.findById(req.params.chefId);

      if (!chef) {
          return res.status(404).json({ error: 'Chef not found' });
      }

      // Set unblock time 30 seconds later than the current time
        const unblockTime = new Date();
        unblockTime.setSeconds(unblockTime.getSeconds() + 30);

          // Block the chef
          chef.isBlocked = true;
          chef.blockCount += 1;
          chef.unblockTime = unblockTime; // Reset unblock time
          await chef.save();

          // Create a notification message for the blocked chef
          const notification = new ChefNotification({
              user: chef._id,
              type: 'chef block',
              notification_text: 'You have been blocked by an admin due to inappropriate behavior.',
          });
          await notification.save();

          return res.json({
              message: 'Chef blocked successfully',
                unblockTime: chef.unblockTime,          
              proof: proof, // Include proof in the response
          });
    
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to block a nutritionist based on a report
router.post('/block-nutritionist/:nutritionistId', authenticateToken, async (req, res) => {
  try {
    const nutritionist = await Nutritionist.findById(req.params.nutritionistId);

    if (!nutritionist) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }

    // Block the nutritionist
    nutritionist.isBlocked = true;
    nutritionist.blockCount += 1;
    nutritionist.unblockTime = null; // Reset unblock time
    await nutritionist.save();

    // Create a notification message for the blocked nutritionist
    const notification = new NutritionistNotification({
      user: nutritionist._id,
      type: 'nutritionist block',
      notification_text: 'You have been blocked by an admin due to inappropriate behavior.',
    });
    await notification.save();

    return res.json({
      message: 'Nutritionist blocked successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to block a vendor based on a report
router.post('/block-vendor/:vendorId', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

      // Set unblock time 30 seconds later than the current time
      const unblockTime = new Date();
      unblockTime.setSeconds(unblockTime.getSeconds() + 30);

    // Block the vendor
    vendor.isBlocked = true;
    vendor.blockCount += 1;
    vendor.unblockTime = unblockTime; 
    await vendor.save();

    // Create a notification message for the blocked vendor
    const notification = new VendorNotification({
      user: vendor._id,
      type: 'vendor block',
      notification_text: 'You have been blocked by an admin due to inappropriate behavior.',
    });
    await notification.save();

    return res.json({
      message: 'Vendor blocked successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  /////////////////////VIEW BLOCK REPORTS ///////////////////////////////////

// Endpoint to view nutritionist block reports
router.get('/view-nutritionist-block-reports', authenticateToken, async (req, res) => {
  try {
    // Fetch all nutritionist block reports with the nutritionist details and proof picture
    const blockReports = await NutritionistBlockReport.find().populate('nutritionist').select('reason proof');

    // Convert pictures to base64 and include them in the response
    const blockReportsWithBase64Image = blockReports.map(report => {
      if (report.proof && report.proof.data) {
        const uint8Array = new Uint8Array(report.proof.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...report.toObject(),
          proof: { data: base64ImageData, contentType: report.proof.contentType }
        };
      }
      return report;
    });

    return res.json({ blockReports: blockReportsWithBase64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to view chef block reports
router.get('/view-chef-block-reports', authenticateToken, async (req, res) => {
  try {
    // Fetch all chef block reports with the chef details and proof picture
    const blockReports = await ChefBlockReport.find().populate('chef').select('reason proof');

    // Convert pictures to base64 and include them in the response
    const blockReportsWithBase64Image = blockReports.map(report => {
      if (report.proof && report.proof.data) {
        const uint8Array = new Uint8Array(report.proof.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...report.toObject(),
          proof: { data: base64ImageData, contentType: report.proof.contentType }
        };
      }
      return report;
    });

    return res.json({ blockReports: blockReportsWithBase64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  // Endpoint to view vendor block reports
router.get('/view-vendor-block-reports', authenticateToken, async (req, res) => {
  try {
    // Fetch all vendor block reports with the vendor details and proof picture
    const blockReports = await VendorBlockReport.find().populate('vendor').select('reason proof');

    // Convert pictures to base64 and include them in the response
    const blockReportsWithBase64Image = blockReports.map(report => {
      if (report.proof && report.proof.data) {
        const uint8Array = new Uint8Array(report.proof.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...report.toObject(),
          proof: { data: base64ImageData, contentType: report.proof.contentType }
        };
      }
      return report;
    });

    return res.json({ blockReports: blockReportsWithBase64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  module.exports = router;
