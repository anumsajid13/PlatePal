const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const CollaborationRequest = require('../../models/CollaborationRequest Schema');
const VendorNotification = require('../../models/Vendor_Notification Schema');
const Recipe = require('../../models/Recipe Schema');
const Chef = require('../../models/Chef Schema');

//make a collab request to a vendor 
router.post('/sendCollabRequest/:recipeId/:vendorId', authenticateToken,  async (req, res) => {

    const loggedInUserId = req.user.id;
    const recipeId = req.params.recipeId;
    const vendorId = req.params.vendorId;

    try {

        const existingRequest = await CollaborationRequest.findOne({
          chef: loggedInUserId,
          vendor: vendorId,
          recipe: recipeId
        });
    
        if (existingRequest) {
          return res.status(400).json({ message: 'Collaboration request already sent for this recipe to this vendor' });
        }

        //get the recipe by ID to access its ingredients
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
        }

        //get ingredient names from the recipe
        const ingredients = recipe.ingredients.map(ingredient => ({
          name: ingredient.name,
          quantity: ingredient.quantity
        }));

        //finding the chef details by ID
        const chefDetails = await Chef.findById(loggedInUserId);
        if (!chefDetails) {
        return res.status(404).json({ message: 'Chef not found' });
        }
        
        //creating a new collab request
        const collabRequest = new CollaborationRequest({
        chef: loggedInUserId,
        vendor: vendorId,
        recipe: recipeId,
        ingredients: ingredients,
        });
  
        await collabRequest.save();

        //notify the vendor about the collab request
        const notification = new VendorNotification({
            vendor: vendorId,
            chef: loggedInUserId,
            type: 'Collab Request',
            notification_text: `Chef ${chefDetails.name} has sent a collab request for the recipe: ${recipe.title.replace(/"/g, '')}`,
        });
        await notification.save();

        res.status(201).json({ message: 'Collab request sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

//view all collabs (chef-logged in)
router.get('/collabRequests', authenticateToken, async (req, res) => {
  const loggedInChefId = req.user.id;

  try {
    // Find collaboration requests for the logged-in chef
    const requests = await CollaborationRequest.find({ chef: loggedInChefId })
      .populate('vendor', 'name') // Populate vendor name
      .populate('chef', 'name') // Populate chef name
      .populate('recipe', 'title') // Populate recipe name
      .select('vendor chef recipe ingredients Time isAccepted'); // Select required fields

    res.status(200).json({ collabRequests: requests });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



module.exports = router;
