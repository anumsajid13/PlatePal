const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const VendorCollaboration = require('../models/VendorCollaboration');
const CollaborationRequest = require('../models/CollaborationRequest');

// Endpoint to create a new vendor collaboration request


  
//Endpoint to see  a specific collaboration request of a chef
router.get('/vendor/collaboration-request/:collaborationRequestId', authenticateToken, async (req, res) => {
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

//Endpoint to see all collaboration request of a vendor with a chef 
router.get('/vendor/collaborations-request', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user._id;
  
      // Extract query parameters for filtering, sorting, and pagination
      const { chefId, sortBy, sortOrder, page=1, pageSize=30 } = req.query; //pagesize = number of collaborations per page
  //filtering
      const query = { vendor: vendorId };
      if (chefId) {
        query.chef = chefId;
      }
      query.isAccepted = false;
  
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
      const collaborations = await CollaborationRequest.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(pageSize))
    /*     .populate('chef') // Populate the 'chef' field with chef details
        .populate('recipe') // Populate the 'recipe' field with recipe details
        .populate('ingredients'); // Populate the 'ingredients' field with ingredient details */
  
      return res.json(collaborations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Endpoint to accept a collaboration request
router.put('/vendor/collaboration/:collaborationId/accept', authMiddleware, async (req, res) => {
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
router.delete('/vendor/collaboration/:collaborationId', authMiddleware, async (req, res) => {
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
  