const express = require('express');
const router = express.Router();
const VendorCollaboration = require('../../models/VendorCollaboration Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const vendor = require('../../models/Vendor Schema');
const Ingredient = require('../../models/Ingredient Schema');
  
//Endpoint to see all collaborations of a vendor with a chef 
router.get('/', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Extract query parameters for filtering, sorting, and pagination
    const { chefId, sortBy, sortOrder, page=1, pageSize=30 } = req.query; //pagesize = number of collaborations per page
//filtering
    const query = { vendor: vendorId };
    if (chefId) {
      query.chef = chefId;
    }
 
    //sorting
    const sort = {};
    if(!sortBy)
    {
      sort[sortBy]=1;
    }
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    //skippvalue
    const skip = (page - 1) * pageSize;

    // Find collaborations for the specified vendor and chef
    const collaborations = await VendorCollaboration.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(pageSize))
  
      

    return res.json(collaborations);
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
    console.log("nsdjans")
    console.log("x",collaborationWithIngredients);
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
