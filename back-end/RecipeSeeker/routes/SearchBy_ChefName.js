const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');
const Chef = require('../../models/Chef Schema');

router.get('/searchRecipesByChef/:chefName', async (req, res) => {
  try {
    const { chefName } = req.params;

    const chef = await Chef.findOne({ name: { $regex: new RegExp(chefName, 'i') } });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const recipes = await Recipe.find({ chef: chef._id })
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
