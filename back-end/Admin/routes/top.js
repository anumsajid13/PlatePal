const Chef = require('../../models/Chef Schema');
const Nutritionist = require('../../models/Nutritionist Schema');
const express = require('express');

const router = express.Router();

  // Endpoint to get the top chefs based on followers
  router.get('/top-chefs', async (req, res) => {
    try {
      const topChefs = await Chef.find({ isBlocked: false })
        .sort({ followers: -1 })
        .limit(5)
        .select('name followers profilePicture')
        .populate('followers', '_id'); // Populate the 'followers' array with only the _id field
  
      const topChefsWithFollowerCount = topChefs.map(chef => ({
        ...chef._doc,
        followers: chef.followers.length, // Replace the followers array with its length (follower count)
      }));
  
      return res.json({ topChefs: topChefsWithFollowerCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Endpoint to get the top nutritionists based on followers
router.get('/top-nutritionists',  async (req, res) => {
    try {
      // Fetch top nutritionists based on followers (you can adjust the sorting criteria as needed)
      const topNutritionists = await Nutritionist.find({ isBlocked: false }).sort({ followers: -1 }).limit(10);
  
      return res.json({ topNutritionists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  module.exports = router;