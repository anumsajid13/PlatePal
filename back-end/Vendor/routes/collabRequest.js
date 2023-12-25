const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const VendorCollaboration =require('../../models/VendorCollaboration Schema');
const CollaborationRequest = require('../../models/CollaborationRequest Schema');
const Chef=require('../../models/Chef Schema');
const Recipe=require('../../models/Recipe Schema');
const Ingredient=require('../../models/Ingredient Schema');


//Endpoint to see all collaboration request of a vendor with a chef 
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("inside collaboration request",req.body,req.user._id);
     const { chefId, sortBy, sortOrder, page=1, pageSize=30 } = req.query; //pagesize = number of collaborations per page
//filtering
 /*    //const query = { vendor:req.user.id}; */
   

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
    const collaborationReq = await CollaborationRequest.find({vendor:req.user.id})
      .sort(sort)
      .skip(skip)
      .limit(parseInt(pageSize))
   
  /*     const processedCollaborationRequests = [];
    for (const request of collaborationReq) {
      
      const chef = await Chef.findOne({ _id: request.chef });
      const recipename=await Recipe.findOne({_id:request.recipe});
 
      processedCollaborationRequests.push({
        chefName: chef ? chef.name : null, 
        isAccepted: request.isAccepted,
        time: request.Time,
        recipeName: recipename? recipename.title:null,
      }); */

   
   return res.json(collaborationReq); 
  //}
  //return res.json(processedCollaborationRequests ); 
}
   catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
  
//Endpoint to see  a specific collaboration request of a chef
router.get('/:collaborationRequestId', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user._id;
      const collaborationReqId = req.params.collaborationRequestId;
   
      const request = await CollaborationRequest.findOne({_id: collaborationReqId,vendor: vendorId})

      if (!request) {
        return res.status(404).json({ message: 'Collaboration request not found' });
      }
  
      return res.json(request);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  
  router.put('/accept/:collaborationRequestId', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id;
      const collaborationRequestId = req.params.collaborationRequestId;
  console.log("vendor",vendorId,"collab",collaborationRequestId);
   
      const collaborationRequest = await CollaborationRequest.findOne({
        _id: collaborationRequestId,
        vendor: vendorId,
        isAccepted: 'pending',
      });
  
      if (!collaborationRequest) {
        return res.status(404).json({ message: 'Collaboration request not found or already accepted/rejected.' });
      }
  

      const ingredientIds = collaborationRequest.ingredients.map(ingredient => ingredient.name);
      const vendorIngredients = await Ingredient.find({
        name: { $in: ingredientIds },
        vendor: vendorId,
      });
      console.log("names",ingredientIds );
  console.log("vendor",vendorIngredients);
  console.log("vendor",vendorIngredients.length);
  console.log("collab",collaborationRequest.ingredients.length);
      if (vendorIngredients.length !== collaborationRequest.ingredients.length) {
        return res.status(400).json({ message: 'Invalid ingredients in the collaboration request.' });
      }
  
      // Create a collaboration object
      const vendorCollaboration = new VendorCollaboration({
        vendor: collaborationRequest.vendor,
        chef: collaborationRequest.chef,
        recipe: collaborationRequest.recipe,
        ingredients: vendorIngredients.map(ingredient => ingredient._id),
        Time: collaborationRequest.Time,
      });
  
     
      await vendorCollaboration.save();
  
      // Update collaboration request status
      collaborationRequest.isAccepted = 'accepted';
      await collaborationRequest.save();
  
      return res.json({ message: 'Collaboration request accepted successfully', collaboration: vendorCollaboration });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  // Endpoint to delete a collaboration request
router.delete('/delete/:collaborationId', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user._id;

      const collaborationId = req.params.collaborationId;
      const collaboration = await CollaborationRequest.findOne({ _id: collaborationId, vendor: vendorId });
  
      if (!collaboration) {
        return res.status(404).json({ message: 'Collaboration request not found' });
      }
      await collaboration.remove();
  
      return res.json({ message: 'Collaboration request deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.get('/chef/:chefId', async (req, res) => {
    try {
      const { chefId } = req.params;
  
      // Find chef by ID
      const chef = await Chef.findById(chefId);
  
      if (!chef) {
        return res.status(404).json({ message: 'Chef not found' });
      }
  
      // Send chef name in the response
      return res.json({ chefName: chef.name });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Endpoint to get recipe name by ID
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Find recipe by ID
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Send recipe name in the response
    return res.json({ recipeName: recipe.title });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

  module.exports = router;