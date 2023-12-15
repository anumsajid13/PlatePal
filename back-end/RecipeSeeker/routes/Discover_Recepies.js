const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe Schema');


router.get('/allRecipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .populate({
            path:'Rating',
            populate:{
                path:'ratingNumber user Time',
                model:'Comment Schema'
        }
      })
      .populate(
        {
            path:'comments',
            populate:{
                path:'comment user Time', //will have to make a route to display the name of the one who commented, cuz there are t2 possibilities: recepie seeekr or chef
                model:'Comment'
            }
        }
      )
      .populate({
        path: 'chef',
        populate: {
          path: 'name',
          model: 'Chef Schema',
        },
      })
      .exec();

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
