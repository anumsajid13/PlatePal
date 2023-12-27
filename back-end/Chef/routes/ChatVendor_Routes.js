const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication'); 
const VendorChefInbox = require('../../models/Vendor-Chef_Inbox Schema');
const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const VendorNotification = require('../../models/Vendor_Notification Schema');

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
    let vendorChefInbox = await VendorChefInbox.findOne({ chef: req.user.id, vendor: vendorId });
    if (!vendorChefInbox) {
        vendorChefInbox = new VendorChefInbox({
        chef: req.user.id,
        vendor: vendorId,
        messages: [],
      });
    }

    //fetch the chef's name
    const chefName = chef.name;

    //add the new message to the messages array with the author as the chef's name
    vendorChefInbox.messages.push({
      message: messageContent,
      author: chefName,
      time: new Date(),
    });

    //save the Vendor_Chef_Inbox document
    const savedVendorChefInbox = await vendorChefInbox.save();

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

    res.status(201).json({ message: 'Message sent successfully', data: savedVendorChefInbox });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



router.get('/allVendors', async (req, res) => {
  try {
    const users = await Vendor.find({}, 'name profilePicture');

    const usersWithBase64Image = users.map(user => {
      if (user.profilePicture && user.profilePicture.data && user.profilePicture.contentType) {
        try {
          const base64ImageData = user.profilePicture.data.toString('base64');
          return {
            ...user._doc,
            profilePicture: { data: base64ImageData, contentType: user.profilePicture.contentType },
           
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
          return {
            ...user._doc,
            profilePicture: { data: '', contentType: user.profilePicture.contentType }, 
            
          };
        }
      } else {
       
        return {
          ...user._doc,
          profilePicture: { data: '', contentType: '' }, 
          
        };
      }
    });
    
    console.log(usersWithBase64Image)
    //console.log("hahhaha",topChefsWithBase64Image)
    return res.json( usersWithBase64Image);

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/vendorchatMessages/:vendorId', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    const chef = await Chef.findById(req.user.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    //find the Vendor_Chef_Inbox document for the specified vendor and user
    const vendorChefInbox  = await VendorChefInbox.findOne({ vendor: vendorId, chef: chef._id });

    if (!vendorChefInbox) {
      return res.status(404).json({ message: 'VendorChefInbox not found' });
    }

    //Extract messages, author names, and times
    const chatMessages = vendorChefInbox.messages.map((message) => ({
      _id: message._id,
      message: message.message,
      author: message.author,
      time: message.time,
    }));

    res.status(200).json({ messages: chatMessages });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;
