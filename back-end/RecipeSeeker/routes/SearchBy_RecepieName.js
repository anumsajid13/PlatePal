const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');

router.get('/searchRecipesByName/:recipeName', async (req, res) => {
  try {
    const { recipeName } = req.params;

    
    const recipes = await Recipe.find({ title: { $regex: new RegExp(recipeName, 'i') } })
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
      .exec();
    
      console.log("recees:",recipes)
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

// Route to search recipes by categories
router.get('/searchByCategory/:categories', async (req, res) => {
  try {
  
    const categories = req.params; 
     console.log("categories ",categories)

    if (!categories) {
      return res.status(400).json({ message: 'Invalid category provided' });
    }

   
   // const lowerCaseCategories =  categories.categories.toLowerCase();
    console.log("lowerCaseCategories ",categories.categories)


    const recipes = await Recipe.find({ category: { $in:  categories.categories } })
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
    .exec();
    console.log("recees:",recipes)
    const recipesWithBase64Image = recipes.map(recipe => {
      const uint8Array = new Uint8Array(recipe.recipeImage.data);
      const base64ImageData = Buffer.from(uint8Array).toString('base64');
      return {
        ...recipe.toObject(),
        recipeImage: { data: base64ImageData, contentType: recipe.recipeImage.contentType }
      };
    });
    console.log("recipe data: ",recipesWithBase64Image);
    res.status(200).json(recipesWithBase64Image);
  
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
