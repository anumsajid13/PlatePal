const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Vendor = require('../../models/Vendor Schema');
const router = express.Router();
require('dotenv').config();
const multer = require('multer');
 // Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });


 // Endpoint to get vendor information by ID
 router.get('/profile', authenticateToken, async (req, res) => {
  console.log("im in profile",req.user.id);
  

  try {
    const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      console.log("im in profile",vendor);
      return res.status(404).json({ message: 'Vendor not found' });
     
    }
/* const name=vendor.name;
const email=vendor.email;
const username=vendor.username; */
const { name, username, email, profilePicture, certificationImage } = vendor;
console.log("this is vendir",vendor);
    console.log("im in profile", name, username, email);
    return res.json({name, username, email,profilePicture, certificationImage });
  
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
 
 // login route
 router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
      res.status(400).send("Username and password are required");
      return;
  }
  
    try {
    //checking if user exists
      const user = await Vendor.findOne({ username });
      if(!user){
        return res.status(401).send("Invalid username.");
      }
      //checking if password is correct
      const validpass=await bcrypt.compare(password, user.password);
      if(!validpass){
        return res.status(401).send("Invalid password.");
      }
      //checking if user is active
        if (!user.isBlocked) {
          // Create token
          const token = jwt.sign(
            {id:user.id,email:user.email, name:user.name,username:user.username},
            process.env.SECRET_KEY
          );
          // Assign token to the user and save back to the database
          user.token = token;
          await user.save();
          //return res.status(200).send({user, message: "Successful login"});
         return res.json({ message: 'Signin successful', token });
          //res.status(200).json({ token });//returning token

        } else {
          return res.status(403).send('Access denied - you were blocked by the admin');
        }
      } 
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error", error: error });
    }
  });

  //edit profile
  router.put('/editprofile', authenticateToken, async (req, res) => {
    try {
      const updatedUser = await Vendor.findByIdAndUpdate(req.user.id,  { $set: req.body }, { new: true });
      if(!updatedUser){
        return res.status(401).json({message:"Invalid email."});
      }
      await updatedUser.save();
      return res.status(200).json({message:'Profile updated successfully',data:updatedUser});
    } catch (error) {
      console.error(error);
      return res.status(500).json({message:"Internal Server Error",error});
    }
  });

//ForgetPassword
router.post('/forgotpassword', async (req,res) => {

  const { email, newPassword,oldPassword } = req.body;

  try{

      //find chef by email
      const vendor = await Vendor.findOne({ email });
   
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


  //delete profile
  router.delete('/deleteprofile', authenticateToken, async (req, res) => {
    try {
      const deletedUser = await Vendor.findByIdAndDelete(req.user.id);
      if(!deletedUser){
        return res.status(401).send("Invalid email.");
      }
      return res.status(200).send('Profile deleted successfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

 
  module.exports = router;
  