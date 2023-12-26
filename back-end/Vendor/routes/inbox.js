const express = require('express');
const router = express.Router();
const Vendor = require('../../models/Vendor Schema');
const VendorChefInbox = require('../../models/Vendor-Chef_Inbox Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Chef_Notification = require('../../models/Chef_Notification Schema');
const Chef = require('../../models/Chef Schema');

// Endpoint to get all messages for a vendor
router.get('/', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id; 

    const inboxEntry = await VendorChefInbox.find({ vendor: vendorId }); 

    if (!inboxEntry) {
      return res.status(404).json({ message: 'No inbox entry found for the vendor' });
    }
  

    res.json(inboxEntry.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get an array of chefs with names
/* router.get('/chefs', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id; 

    // Find all documents in the collection that match the vendorId
    const inboxEntries = await VendorChefInbox.find({ vendor: vendorId }); 

    if (!inboxEntries || inboxEntries.length === 0) {
      return res.status(404).json({ message: 'No inbox entries found for the vendor' });
    }

    const chefIds = inboxEntries.map(entry => entry.chef);
    const chefnames = await Chef.find({ _id: { $in: chefIds } });
    
    const chefs = chefnames.map(chef => ({
      chefId: chef._id,
      name: chef.name,
    }));
    

    return res.json(chefs);
  } catch (error) {
    console.error(error);
   return res.status(500).json({ message: 'Internal Server Error' });
  }
});
 */
router.get('/chefs', async (req, res) => {
  try {
    const chefs = await Chef.find({}, '_id name'); // Fetch only _id and name fields
    res.json(chefs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to reply to messages in the inbox
router.post('/sendmessage', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id; 
      const { chefId, message } = req.body;
  
      let inboxEntry = await VendorChefInbox.findOne({ chef:chefId});
  
      if (!inboxEntry) {
        inboxEntry = new VendorChefInbox({ vendor: vendorId, chef: chefId, messages: [] });
      }
      const vendor=await Vendor.findById(vendorId);
      inboxEntry.messages.push({
        message,
        author: vendor.name,
        time: new Date(),
      });
  
      await inboxEntry.save();


    //create a notification for vendor
    const chefNotification = new Chef_Notification({
      vendor: vendorId,
      chef: chefId,
      type: `message`, 
      notification_text: `Vendor ${vendor.name} sent you a message.`,
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
router.get('/retrievemessages/:chefId', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id;
      const chefId = req.params.chefId;
  
      const inboxEntry = await VendorChefInbox.findOne({ vendor: vendorId, chef: chefId });
  
      if (!inboxEntry) {
        return res.status(404).json({ message: 'No inbox entry found for the specified chef' });
      }

      const messages = inboxEntry.messages;
  
      res.json( messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  //endpoint to delete all messages from a certain chef
  //endpoint to delete his messages to a certain chef
  
module.exports = router;
 

