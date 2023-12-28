const Chef = require('../../models/Chef Schema');
const Nutritionist = require('../../models/Nutritionist Schema');
const Vendor= require('../../models/Vendor Schema');

const express = require('express');

const router = express.Router();
//count no of chef followers

router.get('/top-chefs', async (req, res) => {
  try {
    const topChefs = await Chef.aggregate([
      {
        $match: { isBlocked: false }
      },
      {
        $unwind: '$followers'
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          username: { $first: '$username' },
          profilePicture: { $first: '$profilePicture' },
          followersCount: { $sum: 1 } ,// Count followers
        }
      },
      {
        $sort: { followersCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    
    const topChefsWithBase64Image = topChefs.map(chef => {
      if (chef.profilePicture && chef.profilePicture.data && chef.profilePicture.contentType) {
        try {
          const base64ImageData = chef.profilePicture.data.toString('base64');
          return {
            _id: chef._id,
            name: chef.name,
            username: chef.username,          
            profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
            followers: chef.followersCount,
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
          return {
            _id: chef._id,
            name: chef.name,
            username: chef.username,
            profilePicture: { data: '', contentType: chef.profilePicture.contentType }, 
            followers: chef.followersCount,
          };
        }
      } else {
       
        return {
          _id: chef._id,
          name: chef.name,
          username: chef.username,
           profilePicture: { data: '', contentType: '' }, 
          followers: chef.followersCount,

        };
      }
    });
    

    //console.log("hahhaha",topChefsWithBase64Image)
    return res.json({ topChefs: topChefsWithBase64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/top-nutritionists', async (req, res) => {
  try {
    const topNutritionists = await Nutritionist.aggregate([
      {
        $match: { isBlocked: false }
      },
      {
        $unwind: '$followers'
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          username: { $first: '$username' },
          profilePicture: { $first: '$profilePicture' },
          followersCount: { $sum: 1 } // Count followers
        }
      },
      {
        $sort: { followersCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const topNutritionistsWithBase64Image = topNutritionists.map(nutritionist => {
      if (nutritionist.profilePicture && nutritionist.profilePicture.data && nutritionist.profilePicture.contentType) {
        try {
          const base64ImageData = nutritionist.profilePicture.data.toString('base64');
          return {
            _id: nutritionist._id,
            name: nutritionist.name,
            username: nutritionist.username,
                        profilePicture: { data: base64ImageData, contentType: nutritionist.profilePicture.contentType },
            followers: nutritionist.followersCount,
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
          return {
            _id: nutritionist._id,
            name: nutritionist.name,
            username: nutritionist.username,
                        profilePicture: { data: '', contentType: nutritionist.profilePicture.contentType }, 
            followers: nutritionist.followersCount,
          };
        }
      } else {
        return {
          _id: nutritionist._id,
          name: nutritionist.name,
          username: nutritionist.username,
                    profilePicture: { data: '', contentType: '' }, 
          followers: nutritionist.followersCount,
        };
      }
    });

    return res.json({ topNutritionists: topNutritionistsWithBase64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to get the top vendors based on collabNum
router.get('/top-vendors', async (req, res) => {
  try {
    const topVendors = await Vendor.find({ isBlocked: false })
      .sort({ collabNum: -1 }) // Sort by collabNum in descending order
      .limit(5)
      .select('name username collabNum profilePicture'); // Include collabNum in the select

    const topVendorsWithBase64Image = topVendors.map(vendor => {
      const uint8Array = new Uint8Array(vendor.profilePicture.data);
      const base64ImageData = Buffer.from(uint8Array).toString('base64');
      return {
        ...vendor.toObject(),
        profilePicture: { data: base64ImageData, contentType: vendor.profilePicture.contentType },
      };
    });

    return res.json({ topVendors: topVendorsWithBase64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  module.exports = router;