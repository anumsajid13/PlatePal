const express = require('express');
const router = express.Router();
const VendorChefInbox = require('../../models/Vendor-Chef_Inbox Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Chef_Notification = require('../../models/Chef_Notification Schema');

// Endpoint to get all messages for a vendor
router.get('/', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.vendorId; 

    const inboxEntry = await VendorChefInbox.findOne({ vendor: vendorId }); 

    if (!inboxEntry) {
      return res.status(404).json({ message: 'No inbox entry found for the vendor' });
    }
    const messages = inboxEntry.messages;

    res.json({ messages, chef: inboxEntry.chef });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Endpoint to reply to messages in the inbox
router.post('/sendmessage', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.vendorId; 
      const { chefId, message } = req.body;
  
      let inboxEntry = await VendorChefInbox.findOne({ vendor: vendorId });
  
      if (!inboxEntry) {
        inboxEntry = new VendorChefInbox({ vendor: vendorId, chef: chefId, messages: [] });
      }
  
      inboxEntry.messages.push({
        message,
        author: 'vendor',
        time: new Date(),
      });
  
      await inboxEntry.save();


    //create a notification for vendor
    const chefNotification = new Chef_Notification({
      vendor: vendorId,
      chef: req.user.id,
      type: `message`, 
      notification_text: `Vendor ${chefName} sent you a message.`,
      Time: new Date(),
    });

     await chefNotification.save();
  
      res.json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Endpoint to get messages from a specific chef in the inbox
router.get('retreivemessage/:chefId', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.vendorId;
      const chefId = req.params.chefId;
  
      const inboxEntry = await VendorChefInbox.findOne({ vendor: vendorId, chef: chefId });
  
      if (!inboxEntry) {
        return res.status(404).json({ message: 'No inbox entry found for the specified chef' });
      }

      const messages = inboxEntry.messages;
  
      res.json({ messages, chef: inboxEntry.chef });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  //endpoint to delete all messages from a certain chef
  //endpoint to delete his messages to a certain chef
  
module.exports = router;
 

