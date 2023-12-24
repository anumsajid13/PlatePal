const express = require('express');
const router = express.Router();
const Nutritionist = require('../../models/Nutritionist Schema');

router.get('/allNutritionists', async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({}, 'name profilePicture');

    const nutritionistsWithBase64Image = nutritionists.map((nutritionist) => {
      if (nutritionist.profilePicture && nutritionist.profilePicture.data && nutritionist.profilePicture.contentType) {
        if (typeof nutritionist.profilePicture === 'object') {
          const base64String = Buffer.from(nutritionist.profilePicture.data.buffer).toString('base64');
          return {
            _id: nutritionist._id,
            name: nutritionist.name,
            profilePicture: `data:${nutritionist.profilePicture.contentType};base64,${base64String}`,
          };
        } else {
          return {
            _id: nutritionist._id,
            name: nutritionist.name,
            profilePicture: nutritionist.profilePicture.toString('base64'),
          };
        }
      } else {
        return {
          _id: nutritionist._id,
          name: nutritionist.name,
          profilePicture: null,
        };
      }
    });

    res.status(200).json({ nutritionists: nutritionistsWithBase64Image });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
