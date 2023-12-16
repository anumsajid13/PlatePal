const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const VendorChefInbox = require('../../models/Vendor-Chef_Inbox Schema');
const Chef = require('../../models/Chef Schema');
const VendorNotification = require('../../models/User_Notification Schema');

//route for a chef to send a message to a vendor 
router.post('/sendMessageToVendor/:vendorId', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { messageContent } = req.body;

    //find the logged-in chef based on the token
    const chef = await Chef.findById(req.user.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    //find or create the Vendor_Chef_Inbox document
    let Vendor_ChefInbox = await VendorChefInbox.findOne({ chef: req.user.id, vendor: vendorId });
    if (!Vendor_ChefInbox) {
        Vendor_ChefInbox = new VendorChefInbox({
        chef: req.user.id,
        vendor: vendorId,
        messages: [],
      });
    }

    //fetch the chef's name
    const chefName = chef.name;

    //add the new message to the messages array with the author as the chef's name
    Vendor_ChefInbox.messages.push({
      message: messageContent,
      author: chefName,
      time: new Date(),
    });

    //save the Vendor_Chef_Inbox document
    const savedVendorChefInbox = await VendorChefInbox.save();

    //create a notification for vendor
    const vendorNotification = new VendorNotification({
      vendor: vendorId,
      chef: req.user.id,
      type: `message`, 
      notification_text: `Chef ${chefName} sent you a message.`,
      Time: new Date(),
    });

    //save the UserNotification document
    const savedvendorNotification = await vendorNotification.save();

    res.status(201).json({ message: 'Message sent successfully', data: savedvendorNotification });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
