const express = require('express');
const router = express.Router();
const VendorCollaboration = require('../../models/VendorCollaboration Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const vendor = require('../../models/Vendor Schema');
const Ingredient = require('../../models/Ingredient Schema');
const Chef=require('../../models/Chef Schema');
const Recipe=require('../../models/Recipe Schema');
  
//Endpoint to see all collaborations of a vendor with a chef 
router.get('/', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Extract query parameters for filtering, sorting, and pagination
    const { filterType, filterValue, sortBy, sortOrder } = req.query;
console.log("filter type",filterType,"filter value",filterValue);
console.log("sort by",sortBy,"sort order",sortOrder);
    // Define the query object
    const query = { vendor: vendorId };

    // Filter based on chef or recipe name
    if (filterType && filterValue) {
      if (filterType == 'chef') {
      console.log("filter value",filterValue)
      const regex = new RegExp(filterValue, 'i'); // 'i' for case-insensitive
      const chefid = await Chef.findOne({ name: { $regex: regex } });
        console.log("chef id",chefid)
        if(chefid){
          query.chef = chefid._id;
          console.log("chef id",chefid._id,"query",query.chef)
        } else
        {
          query.chef = null;
        }
       
      } else if (filterType == 'recipe') {
        console.log("filter value",filterValue)
        const recipeId=await Recipe.findOne({ title: { $regex: new RegExp(filterValue, 'i') } });
       console.log("recipe id",recipeId)
       if(recipeId){
        query.recipe = recipeId._id;
        console.log("recipe id",recipeId._id,"query",query.recipe)
      } 
      else{
        query.recipe = null;
      }
      }
    }

    // Sorting
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Find collaborations for the specified vendor and filter criteria
    const collaborations = await VendorCollaboration.find(query).sort(sort);

   

    return res.json(collaborations );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Endpoint to see  a specific collaboration with a chef
router.get('/:collaborationId', authenticateToken, async (req, res) => {
    try {
     console.log("im here");
      // Extract vendor ID from the authenticated user
      const vendorId = req.user._id;
  
      // Extract collaboration ID from the request parameters
      const collaborationId = req.params.collaborationId;
  
      // Find the specific collaboration request for the specified vendor
      const collaboration = await VendorCollaboration.findOne({_id: collaborationId,vendor: vendorId})
       
  
      if (!collaboration ) {
        return res.status(404).json({ message: 'Collaboration not found' });
      }
      const ingredientIds = collaboration.ingredients;

    const vendorIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });
    const collaborationWithIngredients = { ...collaboration.toObject(), ingredients: vendorIngredients };

      return res.json(collaborationWithIngredients);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Endpoint to get ingredient names by IDs
router.post('/names', async (req, res) => {
  try {
    const { ingredientIds } = req.body;

    // Fetch ingredient names based on IDs
    const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } }, 'name');

    const ingredientNames = ingredients.map((ingredient) => ingredient.name);

    res.json({ names: ingredientNames });
  } catch (error) {
    console.error('Error fetching ingredient names:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  module.exports = router;
