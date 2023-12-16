
const admin_Notification = require('../../models/Admin_Notification Schema');

// Endpoint to retrieve all admin notifications
app.get('/admin/notifications', autheticateToken, async (req, res) => {
    try {
      const notifications = await admin_Notification.find({ user: req.user._id });
  
      return res.json({ notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  module.exports = router;
