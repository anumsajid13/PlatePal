
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
const Transaction = require('../../models/Nut-Trans'); // Assuming your model is in a file named 'NutTrans.js'

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
      const allowSignup = nutritionist.allowSignup;
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
        }, certificationImage: {
          data: certificationImage[0].buffer,
          contentType: certificationImage[0].mimetype
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

// get profile
router.get('/get', authenticateToken, async (req, res) => {
  const id = req.user.id;
  try {
    const nutritionist = await Nutritionist.findById(id);
    if (!nutritionist) {
      return res.status(404).json({ message: 'Nutritionist not found' });
    }

    // Convert the image buffer to a Base64 string
    const unit8Array = new Uint8Array(nutritionist.profilePicture.data);
    const base64string = Buffer.from(unit8Array).toString('base64');
    
    const chefDataWithBase64Image = { ...nutritionist._doc, profilePicture: base64string };

    return res.status(200).json(chefDataWithBase64Image);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
});

router.get('/transactions/:nutId', async (req, res) => {
  const nutId = req.params.nutId;
  try {
    // Find transactions for the given nutritionist ID where Paid is not equal to 0
    const transactions = await Transaction.find({
      NutId: nutId, Paid: { $ne: 0 },
    })
      .populate('NutId', 'name') // Populate the 'NutId' field with the nutritionist's name (adjust as needed)
      .populate('sender', 'name') // Populate the 'sender' field with the recipe seeker's name (adjust as needed)
      .populate({
        path: 'recipes',
        model: 'Recipe',
        select: 'title', // Include only the 'title' field from the Recipe model
      })
      .exec();

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the nutritionist' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve transactions' });
  }
});

// Route to get the balance of a nutritionist
router.get('/balance/:nutId', async (req, res) => {
  const nutritionistId = req.params.nutId;

  try {
    // Find the nutritionist by ID
    const nutritionist = await Nutritionist.findById(nutritionistId);

    if (!nutritionist) {
      return res.status(404).json({ message: 'Nutritionist not found' });
    }

    // Extract the balance from the nutritionist
    const balance = nutritionist.balance;

    res.json({balance });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


  module.exports = router;