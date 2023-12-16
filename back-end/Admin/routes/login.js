const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin Schema');
require('dotenv').config();
const router = express.Router();

// Endpoint to login admin
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
  

    // Check if the provided credentials match the predefined admin credentials
    if (username === 'admin' && password === 'admin123') {
      try {
        // Find the admin by username
        const admin = await Admin.findOne({ username });
  
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
  module.exports = router;