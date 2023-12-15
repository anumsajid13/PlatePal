const express = require('express');
const router = express.Router();
const Nutritionist = require('../../models/Nutritionist');

// Endpoint to get all nutritionists
router.get('/all-nutritionists', async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({}, 'name username email address');
    // You can customize the fields you want to retrieve in the second parameter of the find method

    return res.json({ nutritionists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get a specific nutritionist by ID
router.get('/nutritionist/:nutritionistId', async (req, res) => {
    try {
      const nutritionist = await Nutritionist.findById(req.params.nutritionistId);
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      return res.json({ nutritionist });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
