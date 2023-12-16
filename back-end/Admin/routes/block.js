const Nutritionist = require('../../models/Nutritionist Schema');
const Admin = require('../../models/Admin Schema');
const isAdmin = require("./middleware");
const admin_Notification = require('../../models/Admin_Notification Schema');
const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const ChefNotification = require('../../models/Chef_Notification Schema');
const NutritionistBlockReport= require ('../../models/NutritionistBlockReport Schema');
const ChefBlockReport = require('../../models/ChefBlockReport Schema');
const VendorBlockReport = require('../../models/VendorBlockReport Schema');
const autheticateToken = require('../../TokenAuthentication/token_authentication');


// Endpoint to block a chef based on a report
router.post('/block-chef/:chefId', authenticateToken, async (req, res) => {
  try {
      const chef = await Chef.findById(req.params.chefId);

      if (!chef) {
          return res.status(404).json({ error: 'Chef not found' });
      }


      // Retrieve all block reports for the chef
      const blockReports = await ChefBlockReport.find({ chef: chef._id });

      if (blockReports.length === 0) {
          return res.status(400).json({ error: 'No block reports found for the chef' });
      }

      // Define an array of trigger words
      const triggerWords = ['inappropriate content', 'cyberbullying', 'spam', 'hate speech', 'violence'];

      // Check if any block report contains trigger words
      const shouldBlock = blockReports.some(report => triggerWords.some(word => report.reason.includes(word)));

      if (shouldBlock) {
          // Block the chef
          chef.isBlocked = true;
          chef.blockCount += 1;
          chef.unblockTime = null; // Reset unblock time
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
              proof: proof, // Include proof in the response
          });
      } else {
          // If the report does not indicate a reason to block, don't block the chef
          return res.json({ message: 'Chef not blocked' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

  /////////////////////VIEW BLOCK REPORTS ///////////////////////////////////
// Endpoint to view nutritionist block reports
router.get('/admin/view-nutritionist-block-reports', autheticateToken , async (req, res) => {
    try {
      // Fetch all nutritionist block reports
      const blockReports = await NutritionistBlockReport.find().populate('nutritionist');
  
      return res.json({ blockReports });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Endpoint to view chef block reports
router.get('/admin/view-chef-block-reports', autheticateToken , async (req, res) => {
    try {
      // Fetch all chef block reports
      const blockReports = await ChefBlockReport.find().populate('chef');
  
      return res.json({ blockReports });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to view vendor block reports
  router.get('/admin/view-vendor-block-reports', autheticateToken , async (req, res) => {
    try {
      // Fetch all vendor block reports
      const blockReports = await VendorBlockReport.find().populate('vendor');
  
      return res.json({ blockReports });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 

  module.exports = router;
