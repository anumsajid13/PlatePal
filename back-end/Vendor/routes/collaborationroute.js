const express = require('express');
const router = express.Router();
const VendorCollaboration = require('../models/VendorCollaboration');
const authenticateToken = require('../../TokenAuthentication/token_authentication');

//Endpoint to see  a specific collaboration with a chef
router.get('/vendor/collaboration/:collaborationId', authenticateToken, async (req, res) => {
    try {
      // Extract vendor ID from the authenticated user
      const vendorId = req.user._id;
  
      // Extract collaboration ID from the request parameters
      const collaborationId = req.params.collaborationId;
  
      // Find the specific collaboration request for the specified vendor
      const collaboration = await VendorCollaboration.findOne({_id: collaborationId,vendor: vendorId})
       /*  .populate('chef') // Populate the 'chef' field with chef details
        .populate('recipe') // Populate the 'recipe' field with recipe details
        .populate('ingredients'); // Populate the 'ingredients' field with ingredient details */
  
      if (!collaboration ) {
        return res.status(404).json({ message: 'Collaboration not found' });
      }
  
      return res.json(collaboration);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
//Endpoint to see all collaborations of a vendor with a chef 
router.get('/vendor/collaborations', authenticateToken, async (req, res) => {
    try {
      const vendorId = req.user._id;
  
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
    /*     .populate('chef') // Populate the 'chef' field with chef details
        .populate('recipe') // Populate the 'recipe' field with recipe details
        .populate('ingredients'); // Populate the 'ingredients' field with ingredient details */
  
      return res.json(collaborations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
