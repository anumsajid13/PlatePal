const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');


router.get('/allRecipes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 
    console.log("page size: "+ pageSize)
    const skip = (page - 1) * pageSize;

    const recipes = await Recipe.find({})
      .populate({
        path: 'ratings',
        populate: {
          path: 'user',
          model: 'RecipeSeeker',
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          model: 'RecipeSeeker',
        },
      })
      .populate({
        path: 'chef',
        model: 'Chef',
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
