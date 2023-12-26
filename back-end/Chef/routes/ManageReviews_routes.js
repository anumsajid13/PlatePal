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
        .select('Review Time user recipe isPinned');
  
      //map review details including user data, recipe title, and profile pictures
      const reviewsWithDetails = chefReviews.map(review => ({
        Review: review.Review,
        Time: review.Time,
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
      }));
  
      res.status(200).json({ chefReviews: reviewsWithDetails });
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



module.exports = router;
