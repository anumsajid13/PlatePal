
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin'); 

const Nutritionist = require('../models/Nutritionist');

// Endpoint to view certification pictures of nutritionists
router.get('/view-certifications', isAdmin, async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({}, 'name certificationPictures');

    return res.json({ nutritionists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to change the boolean value to allow nutritionists to sign up
router.put('/allow-nutritionist-signup/:nutritionistId', isAdmin, async (req, res) => {
    try {
      const { allowSignup } = req.body;
      const nutritionist = await Nutritionist.findById(req.params.nutritionistId);
  
      if (!nutritionist) {
        return res.status(404).json({ error: 'Nutritionist not found' });
      }
  
      nutritionist.allowSignup = allowSignup;
      await nutritionist.save();
  
      const message = allowSignup
        ? 'Allow nutritionist signup status updated successfully'
        : 'Nutritionist signup is currently not allowed';
  
      return res.json({ message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports=router;