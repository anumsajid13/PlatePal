// Signin
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Cart = require('../../models/Cart Schema');
const express = require('express');
const router = express.Router();

router.post('/recipeSeeker_signin', async (req, res) => {
  try {
    const recipeSeeker = await RecipeSeeker.findOne({ username: req.body.username });

    if (!recipeSeeker) {
      return res.status(404).json({ message: 'RecipeSeeker not found' });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, recipeSeeker.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // Generate a JWT token
    const token = jwt.sign({ id: recipeSeeker._id, name: recipeSeeker.name }, process.env.SECRET_KEY, { expiresIn: '1h' });
      const newCart = new Cart({
        recipeSeekerId: recipeSeeker._id,
        orders: [],
        totalAmount: 0,
      });
      await newCart.save();
      console.log("New cart created!");
    

    console.log("Token: " + token);
    res.json({ message: 'Signin successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
