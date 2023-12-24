const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const VendorCollaboration =require('../../models/VendorCollaboration Schema');
const CollaborationRequest = require('../../models/CollaborationRequest Schema');
const Chef=require('../../models/Chef Schema');
const Recipe=require('../../models/Recipe Schema');


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


  

// Endpoint to accept a collaboration request
router.put('/:icollaborationRequestId/accept', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user._id; 
      const collaborationId = req.params.collaborationId;
      const collaboration = await CollaborationRequest.findOne({ _id: collaborationId, vendor: vendorId });
  
      if (!collaboration) {
        return res.status(404).json({ message: 'Collaboration request not found' });
      }
   const vendorCollaboration = new VendorCollaboration({recipe: collaboration.recipe, chef: collaboration.chef, vendor: collaboration.vendor, Time: collaboration.Time});
      await vendorCollaboration.save();
  
      return res.json({ message: 'Collaboration request accepted successfully', collaboration });
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