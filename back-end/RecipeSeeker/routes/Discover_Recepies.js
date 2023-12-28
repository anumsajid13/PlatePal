const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');


router.get('/allRecipes', async (req, res) => {
  try {
    const page = parseInt(req.query.currentPage) || 1; 
    const pageSize = parseInt(req.query.pageSize) ||12; 
    console.log("page size: "+ pageSize)
    console.log("currentPage",page)

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
      .populate({
        path: 'vendor',
        model: 'Vendor',
      })
      .skip(skip)
      .limit(pageSize)
      .exec();
      
      const recipesWithBase64Image = recipes.map(recipe => {
        const uint8Array = new Uint8Array(recipe.recipeImage.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...recipe.toObject(),
          recipeImage: { data: base64ImageData, contentType: recipe.recipeImage.contentType }
        };
      });
   //   console.log("recipe data: ",recipesWithBase64Image);
      res.status(200).json(recipesWithBase64Image);
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
