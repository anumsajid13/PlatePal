const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');

router.get('/searchRecipesByName/:recipeName', async (req, res) => {
  try {
    const { recipeName } = req.params;

    // Use a case-insensitive regular expression to find recipes by name
    const recipes = await Recipe.find({ title: { $regex: new RegExp(recipeName, 'i') } })
      .populate({
        path: 'ratings',
        populate: {
          path: 'user',
          select: 'name',
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name',
        },
      })
      .populate({
        path: 'chef',
        select: 'name profilePicture', // Select only the 'name' and 'profilePicture' fields of the Chef
      })
      .exec();

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
