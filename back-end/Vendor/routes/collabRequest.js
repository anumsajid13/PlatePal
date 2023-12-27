const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const VendorCollaboration =require('../../models/VendorCollaboration Schema');
const CollaborationRequest = require('../../models/CollaborationRequest Schema');
const Chef=require('../../models/Chef Schema');
const Recipe=require('../../models/Recipe Schema');
const Ingredient=require('../../models/Ingredient Schema');
const Notification=require('../../models/Chef_Notification Schema');
const Vendor=require('../../models/Vendor Schema');


router.get('/', authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Extract query parameters for filtering, sorting, and pagination
    const { sortBy, sortOrder, filterType, filterValue } = req.query;
console.log("im here")
    // Filtering
    const query = { vendor: vendorId };
    console.log("filter type",filterType,"filter value",filterValue);
    if (filterType && filterValue) {
      if(filterType=='status')
      {  query.isAccepted = { $regex: new RegExp(filterValue, 'i') }; 
     /*    query.isAccepted = filterValue; */
      }
      else if (filterType == 'chef') {
        console.log("filter value",filterValue)
        const chefid = await Chef.findOne({ name: { $regex: new RegExp(filterValue, 'i') } });

          console.log("chef id",chefid)
          if(chefid){
            query.chef = chefid._id;
            console.log("chef id",chefid._id,"query",query.chef)
          } 
          else{
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
    if (sortBy && sortBy === 'Time') {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      console.log("sorting",sort);
    }

    // Find collaborations for the specified vendor and chef
    const collaborations = await CollaborationRequest.find(query)
      .sort(sort);

    return res.json(collaborations);
  } catch (error) {
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


  
  router.put('/:collaborationRequestId/accept', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id;
      const collaborationRequestId = req.params.collaborationRequestId;
  
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
  
      if (vendorIngredients.length !== collaborationRequest.ingredients.length) {
        collaborationRequest.isAccepted = 'retracted';
        await collaborationRequest.save();
        return res.status(400).json({ message: 'Invalid ingredients in the collaboration request.' });
      }
  
      const recipe = await Recipe.findOne({ _id: collaborationRequest.recipe });
      recipe.vendor = vendorId;
      await recipe.save();
    
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
  
      const vendor = await Vendor.findById({ _id: vendorId });
      vendor.collabNum++;
      await vendor.save();
  
      const notificationData = {
        user: collaborationRequest.chef,
        type: 'Request accepted',
        notification_text: 'Your collaboration request has been accepted.',
        Time: new Date(),
      };
  
      const notification = new Notification(notificationData);
      await notification.save();
      if (recipe.vendor) {

        const allRequests = await CollaborationRequest.find({ recipe: collaborationRequest.recipe,isAccepted: 'pending' });
  
        for (const request of allRequests) {
          if(request._id!=collaborationRequestId){
          request.isAccepted = 'retracted';
          await request.save();
      
          }
        }
 
        return res.status(400).json({ message: 'This recipe is already assigned to a vendor.' });
      }
      return res.json({ message: 'Collaboration request accepted successfully', collaboration: vendorCollaboration });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' },error.message);
    }
  });
  

  // Endpoint to delete a collaboration request
router.put('/:collaborationId/decline', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user.id;

      const collaborationId = req.params.collaborationId;
      const collaborationRequest = await CollaborationRequest.findOne({ _id: collaborationId, vendor: vendorId });
  
      if (!collaborationRequest) {
        return res.status(404).json({ message: 'Collaboration request not found' });
      }
      collaborationRequest.isAccepted = 'Request declined';
      await collaborationRequest.save();
  
  
      return res.json({ message: 'Collaboration request has been declined successfully' });
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
// Endpoint to delete collaboration requests by IDs
router.post('/delete', async (req, res) => {
  try {
    // Extract collaboration request IDs from the request body
    const collaborationRequestIds = req.body.collaborationRequestIds;

    // Delete collaboration requests from the database
    await CollaborationRequest.deleteMany({ _id: { $in: collaborationRequestIds } });

    res.json({ success: true, message: 'Collaboration requests deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
  module.exports = router;