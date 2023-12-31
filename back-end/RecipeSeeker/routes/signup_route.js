const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

// Signup
router.post('/recipeSeeker_signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new RecipeSeeker
    const recipeSeeker = new RecipeSeeker({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const savedRecipeSeeker = await recipeSeeker.save();
    console.log("Saved to the DB");
    res.status(201).json({ message: 'Signup successful', data: savedRecipeSeeker });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
