const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Recipe = require('../../models/Recipe Schema');
const Comment = require('../../models/Comment Schema');
const Review = require('../../models/Recipe_review');
const Chef = require('../../models/Chef Schema');
const Chef_Notification = require('../../models/Chef_Notification Schema');

router.post('/addComment/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { commentText } = req.body;
    const { recipeId } = req.params;
    const userId = req.user.id;

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

    // Get the chef associated with the recipe
    const chef = await Chef.findById(recipe.chef._id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Create a notification for the chef
    const chefNotification = new Chef_Notification({
      user: chef._id,
      type: 'comment',
      notification_text: `Recipe Seeker added a comment to your recipe ${recipe.title} : ${commentText}`,
    });

    await chefNotification.save();

    res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.post('/addReview/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { reviewText } = req.body;
    const { recipeId } = req.params;
    const userId = req.user.id; 

    // Check if the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Create a new Review
    const newReview = new Review({
      Review: reviewText,
      user: userId,
      recipe: recipeId,
    });

    const savedReview = await newReview.save();

    // Update the recipe's Review array
    recipe.reviews.push(savedReview._id);
    await recipe.save();


    // Get the chef associated with the recipe
    const chef = await Chef.findById(recipe.chef._id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Create a notification for the chef
    const chefNotification = new Chef_Notification({
      user: chef._id,
      type: 'review',
      notification_text: `Recipe Seeker added a Review to your recipe ${recipe.title} : ${reviewText}`,
    });

    await chefNotification.save();
    res.status(201).json({ message: 'Review added successfully', Review: savedReview });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
