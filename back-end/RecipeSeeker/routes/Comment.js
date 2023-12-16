const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Recipe = require('../../models/Recipe Schema');
const Comment = require('../../models/Comment Schema');


router.post('/addComment/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { commentText } = req.body;
    const { recipeId } = req.params;
    const userId = req.user.userId; // Assuming the user ID is stored in the token during authentication

    // Check if the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Create a new comment
    const newComment = new Comment({
      comment: commentText,
      user: userId,
      recipe: recipeId,
    });

    const savedComment = await newComment.save();

    // Update the recipe's comments array
    recipe.comments.push(savedComment._id);
    await recipe.save();

    res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
