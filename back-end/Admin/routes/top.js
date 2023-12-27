const Chef = require('../../models/Chef Schema');
const Nutritionist = require('../../models/Nutritionist Schema');
const Vendor= require('../../models/Vendor Schema');

const express = require('express');

const router = express.Router();

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

    
    const topChefsWithBase64Image = topChefs.map(chef => {
      if (chef.profilePicture && chef.profilePicture.data && chef.profilePicture.contentType) {
        try {
          const base64ImageData = chef.profilePicture.data.toString('base64');
          return {
            ...chef._doc,
            profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
            followers: chef.followersCount,
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
          return {
            ...chef._doc,
            profilePicture: { data: '', contentType: chef.profilePicture.contentType }, 
            followers: chef.followersCount,
          };
        }
      } else {
       
        return {
          ...chef._doc,
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

// Endpoint to get the top nutritionists based on followers
router.get('/top-nutritionists', async (req, res) => {
  try {
    const topNutritionists = await Nutritionist.find({ isBlocked: false })
      .sort({ followers: -1 })
      .limit(5)
      .select('name username followers profilePicture')
      .populate('followers', '_id'); // Populate the 'followers' array with only the _id field

    const topNutritionistsWithBase64Image = topNutritionists.map(nutritionist => {
      const uint8Array = new Uint8Array(nutritionist.profilePicture.data);
      const base64ImageData = Buffer.from(uint8Array).toString('base64');
      return {
        ...nutritionist.toObject(),
        profilePicture: { data: base64ImageData, contentType: nutritionist.profilePicture.contentType },
        followers: nutritionist.followers.length, // Replace the followers array with its length (follower count)
      };
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