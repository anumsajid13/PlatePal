const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const VendorCollaboration =require('../../models/VendorCollaboration Schema');
const CollaborationRequest = require('../../models/CollaborationRequest Schema');
const Chef=require('../../models/Chef Schema');


//Endpoint to see all collaboration request of a vendor with a chef 
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("inside collaboration request",req.body,req.user._id);
     const { chefId, sortBy, sortOrder, page=1, pageSize=30 } = req.query; //pagesize = number of collaborations per page
//filtering
    const query = { vendor:req.user.id};
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
    const collaborationReq = await CollaborationRequest.find()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(pageSize))

    const chef=await Chef.findOne({_id:collaborationReq.chef});

    return res.json(chef.name,collaborationReq.time); 
   // return res.json(collaborationReq); 
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
       /*  .populate('chef') // Populate the 'chef' field with chef details
        .populate('recipe') // Populate the 'recipe' field with recipe details
        .populate('ingredients'); // Populate the 'ingredients' field with ingredient details */
  
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
  
  module.exports = router;