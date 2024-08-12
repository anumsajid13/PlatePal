const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
require('dotenv').config();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Vendor = require('../../models/Vendor Schema');
 const Collaboration=require('../../models/VendorCollaboration Schema'); 
 const CollaborationRequest=require('../../models/CollaborationRequest Schema');
const VendorChefInbox=require('../../models/Vendor-Chef_Inbox Schema');

const multer = require('multer');


// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

// Endpoint to get vendor information by ID
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      console.log("im in profile",vendor);
      return res.status(404).json({ message: 'Vendor not found' });
     
    }
    // Convert the image buffer to a Base64 string
    const unit8Array = new Uint8Array(vendor.profilePicture.data);
    const base64string = Buffer.from(unit8Array).toString('base64');
    
    const vendorDataWithBase64Image = { ...vendor._doc, profilePicture: base64string };

    return res.status(200).json(vendorDataWithBase64Image);
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


//register as new vendor
router.post("/register", upload.fields([ { name: 'certificationImage', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
  try {
    const { name,username, email, password } = req.body;
    const { profilePicture, certificationImage } = req.files;
    if (!(email && password && name && username && profilePicture && certificationImage)) {
      return res.status(400).send({ message: "All fields should be filled." });
    }
   //checking if user already exists
    const oldUser = await Vendor.findOne({ email });
    if (oldUser) {
      return res.status(409).send({ message: "Email already in use." });
    }
    const User = await Vendor.findOne({username });
    if (User) {
      return res.status(409).send({ message: "Username already in use." });
    }

    //encrypting password
    const Password = await bcrypt.hash(password, 10);
    const user = new Vendor({ name:name, username:username,email:email, password:Password,
      profilePicture: {
        data: profilePicture[0].buffer,
        contentType: profilePicture[0].mimetype
      },
      certificationImage: {
        data: certificationImage[0].buffer,
        contentType: certificationImage[0].mimetype
      }
      });
    await user.save();
    res.status(201).json({ message: 'Signup successful', data: user});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});


  // Endpoint to handle nutritionist login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
console.log("body",req.body)
    // Find the nutritionist by username
    const user = await Vendor.findOne({ username });
console.log("user",user)
    if (!user) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

   // Check if the chef is blocked
   if (user.isBlocked) {
    console.log("blocked")
    // Check if the unblock time is set
    if (user.unblockTime) {
      // Check if the unblock time has passed
      if (new Date() >= user.unblockTime) {
        // Unblock the chef
        user.isBlocked = false;
        user.unblockTime = null;
        await user.save();
      } else {
        // is still blocked
        return res.status(403).json({ error: 'Vendor is blocked' });
      }
    } else {
      //  is blocked indefinitely
      return res.status(403).json({ error: 'Vendor is blocked indefinitely' });
    }
  }
  if(user.allowSignup && !user.isBlocked)
   {console.log("allow")
     // Check if the password is correct using bcrypt.compare
     const isPasswordValid =await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
       return res.status(401).json({ error: 'Invalid password' });
     }
 
  const token = jwt.sign({ id: user._id, username: user.username, email: user.email}, process.env.SECRET_KEY);

    return res.json({ message: 'Login successful', token });
   } 
  else{
   return res.status(403).json({ error: 'Admin is reviewing your certificate' });
   }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 
//  // login route
//  router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     console.log(req.body);

//     if (!username || !password) {
//       res.status(400).send("Username and password are required");
//       return;
//   }
  
//     try {
//     //checking if user exists
//       const user = await Vendor.findOne({ username });
//       if(!user){
//         return res.status(401).send("Invalid username.");
//       }
//       //checking if password is correct
//       const validpass=await bcrypt.compare(password, user.password);
//       if(!validpass){
//         return res.status(401).send("Invalid password.");
//       }
//       //checking if user is active
//         if (!user.isBlocked) {
//           // Create token
//           const token = jwt.sign(
//             {id:user.id,email:user.email, name:user.name,username:user.username},
//             process.env.SECRET_KEY
//           );
//           // Assign token to the user and save back to the database
//           user.token = token;
//           await user.save();
//           //return res.status(200).send({user, message: "Successful login"});
//          return res.json({ message: 'Signin successful', token });
//           //res.status(200).json({ token });//returning token

//         } else {
//           return res.status(403).send('Access denied - you were blocked by the admin');
//         }
//       } 
//     catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal Server Error", error: error });
//     }
//   });

router.put('/editProfile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user.id;

    const vendor = await Vendor.findById(userId);

    if (!vendor) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }

    // Update user information with the new data
    vendor.name = req.body.name || vendor.name;
    vendor.email = req.body.email || vendor.email;
    vendor.username = req.body.username || vendor.username;

   if (1=1)
   {
    print("profile picture",req.file);
   }
    // Update profile picture if provided
    if (req.file) {
      vendor.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Save the updated user information
    await vendor.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/* 
router.put('/editprofile', upload.single('profilePicture'), authenticateToken, async (req, res) => {
  try {
    const profilePicture = req.file;
    const { ...otherUpdates } = req.body;

    const updatedUser = await Vendor.findById(req.user.id);

    if (!updatedUser) {
      return res.status(401).json({ message: 'Invalid user.' });
    }

    // Check if a new profile picture has been provided
    if (profilePicture) {
      updatedUser.profilePicture.data = profilePicture.buffer;
      updatedUser.profilePicture.contentType = profilePicture.mimetype;
    }

    // Update other fields if provided
    if (Object.keys(otherUpdates).length > 0) {
      Object.assign(updatedUser, otherUpdates);
    }

    // Save only if changes are made
    if (profilePicture || Object.keys(otherUpdates).length > 0) {
      await updatedUser.save();
      return res.status(200).json({ message: 'Profile updated successfully', data: updatedUser });
    } else {
      return res.status(200).json({ message: 'No changes made to the profile', data: updatedUser });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
});
 */
//ForgetPassword
router.put('/forgotpassword',authenticateToken, async (req,res) => {

  const {  newPassword,oldPassword } = req.body;
  try{

      //find chef by email
      const vendor = await Vendor.findById(req.user.id );
   
      if (!vendor) {
          return res.status(404).json({ message: 'Vendor not found' });
      }
      const validpass=await bcrypt.compare(oldPassword, vendor.password);
      if(!validpass){
        return res.status(401).send("You have entered the wrong password.");
      }
      //generate new hashed password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      //update password in the db
      vendor.password = hashedPassword;
      await vendor.save();

      res.status(200).json({ message: 'Password updated successfully' });

  }
  catch(error){
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});


router.delete('/deleteprofile', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;

    const collaborations = await Collaboration.findByIdAndDelete(vendorId);
    console.log("collaborations", collaborations);

    const inbox = await VendorChefInbox.findByIdAndDelete(vendorId);
    console.log("inbox", inbox);

    const collabrequests = await CollaborationRequest.find({ vendor: vendorId });
    if (collabrequests) {
      for (const request of collabrequests) {
        request.isAccepted = 'declined';
        await request.save();
      }
    }
    console.log("collabrequests", collabrequests);

    const deletedUser = await Vendor.findByIdAndDelete(vendorId);
    if (!deletedUser) {
      return res.status(401).send("Invalid email.");
    }
    console.log("all deleted successfully");
    return res.status(200).send('Profile deleted successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error", error.message, error);
  }
});
router.get('/supplierNotify',authenticateToken, async (req, res) => {
  const vendorId =req.user.id;

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const notifications = vendor.notify;
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



 
  module.exports = router;
  