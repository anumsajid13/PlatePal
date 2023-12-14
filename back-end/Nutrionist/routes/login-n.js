
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Nutritionist = require('../../models/Nutritionist Schema');
require('dotenv').config();
const router = express.Router();

// Endpoint to handle nutritionist login
router.post('/nutritionist-login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the nutritionist by username
      const nutritionist = await Nutritionist.findOne({ username });
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      // Check if the nutritionist is blocked and unblock time has passed
      if (nutritionist.isBlocked && nutritionist.unblockTime && nutritionist.unblockTime <= new Date()) {
        // Unblock the nutritionist
        nutritionist.isBlocked = false;
        nutritionist.unblockTime = null;
        await nutritionist.save();
  
        console.log('Nutritionist unblocked successfully.');
      }
  
      // Check if the password is correct
      if (password !== nutritionist.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
 
    const token = jwt.sign({ id: nutritionist._id, username: nutritionist.username, email: nutritionist.email}, process.env.SECRET_KEY);

      return res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;