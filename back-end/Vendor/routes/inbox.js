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

    let inboxEntry = await VendorChefInbox.findOne({ vendor:req.user.id,chef:chefId});

    if (!inboxEntry) {
      inboxEntry = new VendorChefInbox({ vendor: req.user.id, chef: chefId, messages: [] });
    }
    const vendor=await Vendor.findById(req.user.id);
    inboxEntry.messages.push({
      message,
      author: vendor.name,
      time: new Date(),
    });

    await inboxEntry.save();


 
  const chefNotification = new Chef_Notification({
    user: chefId,
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
console.log("chefId",chefId);
  // Check if chefId is null, and handle it gracefully
  if (chefId == null) {
    res.status(400).json({ message: 'Chef ID is required' });
    return;
  }

  // Find the inbox entry for the specified vendor and chef
  let inboxEntry = await VendorChefInbox.findOne({ vendor: req.user.id, chef: chefId });

  // If no inbox entry is found, create a new one with an empty messages array
  if (!inboxEntry) {
    inboxEntry = new VendorChefInbox({ vendor: vendorId, chef: chefId, messages: [] });
    await inboxEntry.save();
  }

  // Retrieve the messages from the inbox entry
  const messages = inboxEntry.messages || [];

  res.json(messages);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
}
});


module.exports = router;



 

