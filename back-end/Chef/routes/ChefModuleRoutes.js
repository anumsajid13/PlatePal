const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Chef = require('../../models/Chef Schema');
require('dotenv').config();
const router = express.Router();


router.post('/chef-signup', async (req, res) => {
    const { name, username, email, password, address } = req.body;
  
    try {

      //check if all fields are not filled
      if (!(req.body.name && req.body.username && req.body.email && req.body.password && req.user.address)) {
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
        address,
        //certificationImage,
      });
  
      //save the new Chef 
      await newChef.save();
  
      res.status(201).json({ message: 'Chef signed up successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });

router.post('/chef-login', async (req,res) => {
    const { email, password } = req.body;

    try{

        //find chef by email
        const chef = await Chef.findOne({username});

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
        const token = jwt.sign({ id: chef._id, username: chef.username, chef: user.email}, process.env.SECRET);

        res.status(200).json({ token });

    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });

    }

});
  

  module.exports = router;