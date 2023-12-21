// displayComments.js

const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');
const Comment = require('../../models/Comment Schema');

router.get('/comments/:recipeId', async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const populatedRecipe = await Recipe.findById(recipeId).populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'RecipeSeeker',
      },
    });

    if (!populatedRecipe.comments) {
      return res.status(404).json({ message: 'No comments found for the recipe' });
    }

    const commentsData = populatedRecipe.comments.map(comment => ({
      commentText: comment.comment,
      user: comment.user.name, 
      user_id: comment.user._id, 
      time: comment.Time,
    }));

    res.status(200).json({ comments: commentsData });
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
