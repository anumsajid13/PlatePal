const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');

router.get('/uniqueCategories', async (req, res) => {
  try {
   
    const recipes = await Recipe.find({});
    const uniqueCategories = [...new Set(recipes.flatMap(recipe => recipe.category))];
    res.status(200).json({ uniqueCategories });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
