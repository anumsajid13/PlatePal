const Chef = require('../../models/Chef Schema');
const Nutritionist = require('../../models/Nutritionist Schema');
const Vendor= require('../../models/Vendor Schema');

const express = require('express');

const router = express.Router();

// Endpoint to get the top chefs based on followers
router.get('/top-chefs', async (req, res) => {
  try {
    const topChefs = await Chef.find({ isBlocked: false })
      .sort({ followers: -1 })
      .limit(5)
      .select('name  username followers profilePicture')
      .populate('followers', '_id'); // Populate the 'followers' array with only the _id field

    const topChefsWithBase64Image = topChefs.map(chef => {
      const uint8Array = new Uint8Array(chef.profilePicture.data);
      const base64ImageData = Buffer.from(uint8Array).toString('base64');
      return {
        ...chef.toObject(),
        profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
        followers: chef.followers.length, // Replace the followers array with its length (follower count)
      };
    });

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

// // Endpoint to get the top vendors based on followers
// router.get('/top-vendors', async (req, res) => {
//   try {
//     const topVendors = await Vendor.find({ isBlocked: false })
//       .sort({ followers: -1 })
//       .limit(5)
//       .select('name username followers profilePicture')
//       .populate('followers', '_id'); // Populate the 'followers' array with only the _id field

//     const topVendorsWithBase64Image = topVendors.map(vendor => {
//       const uint8Array = new Uint8Array(vendor.profilePicture.data);
//       const base64ImageData = Buffer.from(uint8Array).toString('base64');
//       return {
//         ...vendor.toObject(),
//         profilePicture: { data: base64ImageData, contentType: vendor.profilePicture.contentType },
//         followers: vendor.followers.length, // Replace the followers array with its length (follower count)
//       };
//     });

//     return res.json({ topVendors: topVendorsWithBase64Image });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

  module.exports = router;