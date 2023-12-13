const Nutritionist = require('./Nutritionist Schema');
const Admin = require('./Admin Schema');
const isAdmin = require("./middleware");
const admin_Notification = require('./Admin_Notification Schema');

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
  
      //  receive a report in the request body
      const { report } = req.body;
  
      if (report && report.includes('inappropriate content' ||report.includes('cyberbullying') || report.includes('spam') || report.includes('hate speech') || report.includes('violence'))) 
       {
        // Block the nutritionist
        nutritionist.isBlocked = true;
        await nutritionist.save();

        return res.json({ message: 'Nutritionist blocked successfully' });
      } else {
        // If the report does not indicate a reason to block, don't block the nutritionist
        return res.json({ message: 'Nutritionist not blocked' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Endpoint to send a message or guidelines to a user
app.post('/admin/send-message/:userId', isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { message } = req.body;
  
      // Find the user by ID (adjust this based on your user model)
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Assuming your user model has a field for messages
      user.messages.push({
        from: req.user._id, // Admin sending the message
        content: message,
        timestamp: new Date(),
      });
  
      await user.save();
  
      return res.json({ message: 'Message sent successfully' });
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
  

