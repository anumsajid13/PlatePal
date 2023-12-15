const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Chef = require('../../models/Chef Schema');
require('dotenv').config();
const multer = require('multer');
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

router.post('/signup', upload.fields([ { name: 'certificationImage', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
    const { name, username, email, password } = req.body;
    const { profilePicture, certificationImage } = req.files;
  
    try {

      //check if all fields are not filled
      if (!(name && username && email && password )) {
            return res.status(400).json({ message:'All fields are not provided'});
      }

      //check if the username or email already exists
      const existingChef = await Chef.findOne({ $or: [{ username }, { email }] });
      if (existingChef) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      //hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newChef = new Chef({
        name,
        username,
        email,
        password: hashedPassword,
        profilePicture: {
          data: profilePicture[0].buffer,
          contentType: profilePicture[0].mimetype
        },
        certificationImage: {
          data: certificationImage[0].buffer,
          contentType: certificationImage[0].mimetype
        }
      });
  
      //save the new Chef 
      await newChef.save();
  
      res.status(201).json({ message: 'Your sign up request sent to admin!' });
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

router.post('/login', async (req,res) => {
    const { email, password } = req.body;

    try{

    
        //find chef by email
        const chef = await Chef.findOne({email});

        if(!chef){
            return res.status(404).json({ message: 'Chef not found' });
        }

        const passwordMatch = await bcrypt.compare(password, chef.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (chef.isBlocked) {
            return res.status(403).send('Access denied - you were blocked by the admin');
        }

        //getting token using jwt
        const token = jwt.sign({ id: chef._id, username: chef.username, email: chef.email}, process.env.SECRET_KEY);

        res.status(200).json({ token });

    }
    catch (error) {
        
        res.status(500).json({ message: 'Server Error' });

    }

});
  

  module.exports = router;