const Nutritionist = require('../../models/Nutritionist Schema');
const Admin = require('../../models/Admin Schema');
const isAdmin = require("./middleware");
const admin_Notification = require('../../models/Admin_Notification Schema');
const Chef = require('../../models/Chef Schema');
const Chef = require('../../models/Vendor Schema');
const ChefNotification = require('../../models/Chef_Notification Schema');
const NutritionistBlockReport= require ('../../models/NutritionistBlockReport Schema');
const ChefBlockReport = require('../../models/ChefBlockReport Schema');
const VendorBlockReport = require('../../models/VendorBlockReport Schema');
// Endpoint to login admin
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Check if the provided credentials match the predefined admin credentials
    if (username === 'admin' && password === 'admin123') {
      try {
        // Find the admin by username
        const admin = await Admin.findOne({ username });
  
        if (!admin) {
          return res.status(404).json({ error: 'Admin not found' });
        }
  
        // Create a JWT token with the admin's ID
        const token = jwt.sign({ userId: admin._id },`${process.env.SECRET_KEY}`
        , { expiresIn: '24h' });
  
        return res.json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });


// Endpoint to block a nutritionist based on a report
router.post('/block-nutritionist/:nutritionistId', isAdmin, async (req, res) => {
    try {
      const nutritionist = await Nutritionist.findById(req.params.nutritionistId);
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      // Receive a report in the request body
      const { report,proof } = req.body;
  
      // Define an array of trigger words
      const triggerWords = ['inappropriate content', 'cyberbullying', 'spam', 'hate speech', 'violence'];

      // Check if the report contains any trigger words
      const shouldBlock = triggerWords.some(word => report.includes(word));

      if (shouldBlock) {
        // Block the nutritionist
        nutritionist.isBlocked = true;
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
            proof: proof, // Include proof in the response
          });  }
 else {
        // If the report does not indicate a reason to block, don't block the nutritionist
        return res.json({ message: 'Nutritionist not blocked' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to delete a nutritionist
router.delete('/delete-nutritionist/:nutritionistId', isAdmin, async (req, res) => {
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

  ////////////////////////////////////////////////////////
// Endpoint to view nutritionist block reports
router.get('/admin/view-nutritionist-block-reports', isAdmin, async (req, res) => {
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
router.get('/admin/view-chef-block-reports', isAdmin, async (req, res) => {
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
  router.get('/admin/view-vendor-block-reports', isAdmin, async (req, res) => {
    try {
      // Fetch all vendor block reports
      const blockReports = await VendorBlockReport.find().populate('vendor');
  
      return res.json({ blockReports });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 // Endpoint to send a message or guidelines to a nutritionist
router.post('/admin/send-message-to-nutritionist/:nutritionistId', isAdmin, async (req, res) => {
    try {
      const { nutritionistId } = req.params;
      const { message } = req.body;
  
      // Find the nutritionist by ID
      const nutritionist = await Nutritionist.findById(nutritionistId);
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      // Assuming your Nutritionist model has a field for notifications
      nutritionist.notifications.push({
        content: message,
        timestamp: new Date(),
      });
  
      await nutritionist.save();
  
      return res.json({ message: 'Message sent successfully to nutritionist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Endpoint to delete a chef
router.delete('/delete-chef/:chefId', isAdmin, async (req, res) => {
    try {
      const chef = await Chef.findById(req.params.chefId);
      
      if (!chef) {
        return res.status(404).json({ error: 'Chef not found' });
      }
  
      // Delete chef's notifications (optional)
      await ChefNotification.deleteMany({ user: chef._id });
  
      // Delete the chef
      await chef.remove();
  
      return res.json({ message: 'Chef deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to block a chef
  router.post('/block-chef/:chefId', isAdmin, async (req, res) => {
    try {
      const chef = await Chef.findById(req.params.chefId);
      
      if (!chef) {
        return res.status(404).json({ error: 'Chef not found' });
      }
  
      // Block the chef
      chef.isBlocked = true;
      await chef.save();
      return res.json({ message: 'Chef blocked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to delete a vendor
router.delete('/delete-vendor/:vendorId', isAdmin, async (req, res) => {
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
  
  // Endpoint to block a vendor
  router.post('/block-vendor/:vendorId', isAdmin, async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.vendorId);
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
  
      // Block the vendor
      vendor.isBlocked = true;
      await vendor.save();
  
      return res.json({ message: 'Vendor blocked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Endpoint to retrieve all admin notifications
app.get('/admin/notifications', isAdmin, async (req, res) => {
    try {
      const notifications = await admin_Notification.find({ user: req.user._id });
  
      return res.json({ notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Endpoint to get list of registered chefs
router.get('/admin/list-registered-chefs', isAdmin, async (req, res) => {
    try {
      // Fetch all registered chefs
      const registeredChefs = await Chef.find({ isBlocked: false });
  
      return res.json({ registeredChefs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of blocked chefs
  router.get('/admin/list-blocked-chefs', isAdmin, async (req, res) => {
    try {
      // Fetch all blocked chefs
      const blockedChefs = await Chef.find({ isBlocked: true });
  
      return res.json({ blockedChefs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of registered vendors
  router.get('/admin/list-registered-vendors', isAdmin, async (req, res) => {
    try {
      // Fetch all registered vendors
      const registeredVendors = await Vendor.find({ isBlocked: false });
  
      return res.json({ registeredVendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of blocked vendors
  router.get('/admin/list-blocked-vendors', isAdmin, async (req, res) => {
    try {
      // Fetch all blocked vendors
      const blockedVendors = await Vendor.find({ isBlocked: true });
  
      return res.json({ blockedVendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of registered nutritionists
  router.get('/admin/list-registered-nutritionists', isAdmin, async (req, res) => {
    try {
      // Fetch all registered nutritionists
      const registeredNutritionists = await Nutritionist.find({ isBlocked: false });
  
      return res.json({ registeredNutritionists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of blocked nutritionists
  router.get('/admin/list-blocked-nutritionists', isAdmin, async (req, res) => {
    try {
      // Fetch all blocked nutritionists
      const blockedNutritionists = await Nutritionist.find({ isBlocked: true });
  
      return res.json({ blockedNutritionists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to get the top chefs based on followers
router.get('/admin/top-chefs', isAdmin, async (req, res) => {
    try {
      // Fetch top chefs based on followers (you can adjust the sorting criteria as needed)
      const topChefs = await Chef.find({ isBlocked: false }).sort({ followers: -1 }).limit(10);
  
      return res.json({ topChefs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to get the top nutritionists based on followers
router.get('/admin/top-nutritionists', isAdmin, async (req, res) => {
    try {
      // Fetch top nutritionists based on followers (you can adjust the sorting criteria as needed)
      const topNutritionists = await Nutritionist.find({ isBlocked: false }).sort({ followers: -1 }).limit(10);
  
      return res.json({ topNutritionists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  module.exports = router;
