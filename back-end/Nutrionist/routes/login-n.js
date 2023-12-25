
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); 
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Nutritionist = require('../../models/Nutritionist Schema');
require('dotenv').config();
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');

// Endpoint to handle nutritionist login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the nutritionist by username
      const nutritionist = await Nutritionist.findOne({ username });
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }

      // Check if nutritionist signup is allowed
    const allowSignup = await Nutritionist.findOne({ allowSignup: true });

    if (!allowSignup) {
      return res.status(403).json({ error: 'Nutritionist signup is currently not allowed' });
    }

     // Check if the chef is blocked
     if (nutritionist.isBlocked) {
      // Check if the unblock time is set
      if (nutritionist.unblockTime) {
        // Check if the unblock time has passed
        if (new Date() >= nutritionist.unblockTime) {
          // Unblock the chef
          nutritionist.isBlocked = false;
          nutritionist.unblockTime = null;
          await nutritionist.save();
        } else {
          // is still blocked
          return res.status(403).json({ error: ' nutritionist is blocked' });
        }
      } else {
        //  is blocked indefinitely
        return res.status(403).json({ error: 'nutritionist is blocked indefinitely' });
      }
    }
     
       // Check if the password is correct using bcrypt.compare
       const isPasswordValid = await bcrypt.compare(password, nutritionist.password);

       if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid password' });
       }
   
    const token = jwt.sign({ id: nutritionist._id, username: nutritionist.username, email: nutritionist.email}, process.env.SECRET_KEY);

      return res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

router.post('/signup', upload.fields([ { name: 'certificationImage', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
    const { name, username, email, password } = req.body;
    const { profilePicture, certificationImage } = req.files;
  
    try {
      // Check if all fields are provided
      if (!(name && username && email && password)) {
            return res.status(400).json({ message: 'All fields are not provided' });
      }

      // Check if the username or email already exists
      const existingNutritionist = await Nutritionist.findOne({ $or: [{ username }, { email }] });
      if (existingNutritionist) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newNutritionist = new Nutritionist({
        name,
        username,
        email,
        password: hashedPassword,
        profilePicture: {
          data: profilePicture[0].buffer,
          contentType: profilePicture[0].mimetype
        },
       
      });
  
      // Save the new Nutritionist 
      await newNutritionist.save();
  
      res.status(201).json({ message: 'Nutritionist sign up successful!' });
    } catch (error) {
      console.error('Error during Nutritionist Sign Up:', error);
      res.status(500).json({ message: 'Server Error' });
    }
});


//update profile
router.put('/update', upload.single('profilePicture'), authenticateToken, async (req, res) => {
  const id = req.user.id;
  const { password, newPassword, ...otherUpdates } = req.body;
  const profilePicture = req.file; 
  try {
    const nut = await Nutritionist.findById(id);

    if (!nut) {
      return res.status(404).json({ message: 'Nutritionist not found' });
    }


  if (profilePicture) {
      
      nut.profilePicture.data = profilePicture.buffer; 
      nut.profilePicture.contentType = profilePicture.mimetype;
  }

  if(password && newPassword){

    const passwordMatch = await bcrypt.compare(password, nut.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    nut.password = hashedNewPassword;
    
  }
    Object.assign(nut, otherUpdates);

    const updatedChef = await nut.save();

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

//delete profile
router.delete('/delete', authenticateToken, async (req, res) => {

  const  id  = req.user.id;
  try {
      await Nutritionist.findByIdAndDelete(id);
      res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete profile' });
  }
}); 

  module.exports = router;