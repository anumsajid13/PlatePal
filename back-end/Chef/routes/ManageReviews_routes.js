const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Review = require('../../models/Recipe_review');
const Recipe = require('../../models/Recipe Schema');

//route to get reviews of recipes of the logged-in chef
router.get('/chefReviews', authenticateToken, async (req, res) => {
    try {
      const loggedInChefId = req.user.id;
  
      //find recipes by the logged-in chef
      const chefRecipes = await Recipe.find({ chef: loggedInChefId });
  
      //get recipe IDs
      const recipeIds = chefRecipes.map(recipe => recipe._id);
  
      //find reviews of with these recipes
      const chefReviews = await Review.find({ recipe: { $in: recipeIds } })
        .populate({
          path: 'user',
          select: 'name profilePicture', 
        })
        .populate({
          path: 'recipe',
          select: 'title', 
        })
        .select('Review Time isPinned user recipe');
  
      //separate pinned and unpinned reviews
    const pinnedReviews = [];
    const unpinnedReviews = [];
    chefReviews.forEach(review => {
      const reviewData = {
        _id: review._id,
        Review: review.Review,
        Time: review.Time,
        isPinned: review.isPinned,
        user: {
          _id: review.user._id,
          name: review.user.name,
          profilePicture: review.user.profilePicture
            ? `data:${review.user.profilePicture.contentType};base64,${review.user.profilePicture.data.toString('base64')}`
            : null,
        },
        recipe: {
          _id: review.recipe._id,
          title: review.recipe.title,
        },
      };
      if (review.isPinned) {
        pinnedReviews.push(reviewData);
      } else {
        unpinnedReviews.push(reviewData);
      }
    });

    //concatenate pinned reviews on top of unpinned reviews
    const sortedReviews = [...pinnedReviews, ...unpinnedReviews];

    res.status(200).json({ chefReviews: sortedReviews });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//pin reviews
router.put('/pinReview/:reviewId', authenticateToken, async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      //finding the review by ID
      const review = await Review.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      //updating the review to set it as pinned
      review.isPinned = true; 
  
      await review.save();
  
      res.status(200).json({ message: 'Review pinned successfully', review: review });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//unpin reviews
router.put('/unpinReview/:reviewId', authenticateToken, async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      //finding the review by ID
      const review = await Review.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      //updating the review to set it as unpinned
      review.isPinned = false;
  
      await review.save();
  
      res.status(200).json({ message: 'Review unpinned successfully', review: review });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  


module.exports = router;
