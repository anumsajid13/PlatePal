const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin Schema');
require('dotenv').config();
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const multer = require('multer'); 

// Endpoint to login admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Check if the provided credentials match the predefined admin credentials
    if (username === 'admin' && password === 'admin123') {
      try {
        // Find the admin by username
        const admin = await Admin.find({ username });
        console.log(admin);
  
        if (!admin) {
          return res.status(404).json({ error: 'Admin not found' });
        }
  
        // Create a JWT token with the admin's ID
        const token = jwt.sign({ id: admin._id },`${process.env.SECRET_KEY}`
        , { expiresIn: '24h' });
  console.log(token);
        return res.json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });


  
// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

  // Update Admin Profile
router.put('/update', upload.single('profilePicture'), authenticateToken, async (req, res) => {
  const id = req.user.id;
  const { password, newPassword, ...otherUpdates } = req.body;
  const profilePicture = req.file;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (profilePicture) {
      admin.profilePicture.data = profilePicture.buffer;
      admin.profilePicture.contentType = profilePicture.mimetype;
    }

    if (password && newPassword) {
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedNewPassword;
    }

    Object.assign(admin, otherUpdates);

    const updatedAdmin = await admin.save();

    return res.status(200).json({ message: 'Admin profile updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update admin profile' });
  }
});

// Delete Admin Profile
router.delete('/delete', authenticateToken, async (req, res) => {
  const id = req.user.id;
  try {
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Admin profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete admin profile' });
  }
});

// Get Admin Profile
router.get('/get', authenticateToken, async (req, res) => {
  const id = req.user.id;
  console.log(id)
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Convert the image buffer to a Base64 string
    const unit8Array = new Uint8Array(admin.profilePicture.data);
    const base64string = Buffer.from(unit8Array).toString('base64');

    const adminDataWithBase64Image = { ...admin._doc, profilePicture: base64string };

    return res.status(200).json(adminDataWithBase64Image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve admin profile' });
  }
});




  module.exports = router;