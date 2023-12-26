const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');
const Chef = require('../../models/Chef Schema');

router.get('/searchRecipesByChef/:chefName', async (req, res) => {
  try {
    const { chefName } = req.params;

    const chef = await Chef.findOne({ name: chefName });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const recipes = await Recipe.find({ chef: chef._id })
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
      .populate('chef', 'name profilePicture') 
      .exec();

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
