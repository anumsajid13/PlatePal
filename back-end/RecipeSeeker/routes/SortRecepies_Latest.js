const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');

router.get('/recipesSortedAlphabetically', async (req, res) => {
  try {
 
    const recipes = await Recipe.find({}).sort({ title: 1 });

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
