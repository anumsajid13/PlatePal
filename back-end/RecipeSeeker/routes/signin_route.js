// Signin
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const router = express.Router();

router.post('/signin', async (req, res) => {
    try {
     
      const recipeSeeker = await RecipeSeeker.findOne({ email: req.body.username });
  
      if (!recipeSeeker) {
        return res.status(404).json({ message: 'RecipeSeeker not found' });
      }
  
      //  if the password is correct
      const passwordMatch = await bcrypt.compare(req.body.password, recipeSeeker.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: recipeSeeker._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  
      res.json({ message: 'Signin successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
