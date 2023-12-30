const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Chef = require('../models/Chef Schema')
const RecipeSeeker = require('../models/RecipeSeekerSchema');
const Vendor = require('../models/Vendor Schema');
const Nutritionist = require('../models/Nutritionist Schema')
const Admin = require('../models/Admin Schema');

//to request a password reset
router.post('/forgot-password', async (req, res) => {
    try {
      const { email, userType } = req.body;
  
      let User;
  
      switch (userType) {
        case 'recipeSeeker':
          User = RecipeSeeker;
          break;
        case 'chef':
          User = Chef;
          break;
        case 'vendor':
          User = Vendor;
          break;
        case 'nutritionist':
          User = Nutritionist;
          break;
        case 'admin':
          User = Admin;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = jwt.sign({id: user._id, email: user.email}, process.env.SECRET_KEY, {expiresIn: "1d"})
  
      //send an email with the reset link
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'aiyza.junaid@gmail.com',
          pass: 'bfic rdna ahoh avwa'
        }
      });

      const mailOptions = {
        from: 'aiyza.junaid@gamil.com',
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you  have requested the reset of the password for your account.\n\n`
          + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
          + `http://localhost:3000/reset-password/${userType}/${user._id}/${encodeURIComponent(token)}\n\n`
          + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to send reset email' });
        }
        res.status(200).json({ message: 'Reset email sent' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});

//reset the password
router.post('/reset-password/:userType/:id/:token', async (req, res) => {
    try {
      const { userType, id, token } = req.params;

      //console.log('Received token:', token);
      const { newPassword } = req.body;
  
      //console.log(newPassword)
      let User;
  
      switch (userType) {
        case 'recipeSeeker':
          User = RecipeSeeker;
          break;
        case 'chef':
          User = Chef;
          break;
        case 'vendor':
          User = Vendor;
          break;
        case 'nutritionist':
          User = Nutritionist;
          break;
        case 'admin':
          User = Admin;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      //console.log('Decoded:', decoded);
      if (!decoded) {
        return res.status(400).json({ message: 'Error with token' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await User.findByIdAndUpdate(id, { password: hashedPassword });
  
      //send an email confirmation
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'aiyza.junaid@gmail.com',
          pass: 'bfic rdna ahoh avwa'
        }
      });
  
      const confirmationMailOptions = {
        from: 'aiyza.junaid@gmail.com',
        to: decoded.email, 
        subject: 'Password Reset Successful',
        text: 'Your password has been successfully reset.',
      };
  
      transporter.sendMail(confirmationMailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to send email' });
        }
        console.log('Email sent: ' + info.response);
      });
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  

  module.exports = router;