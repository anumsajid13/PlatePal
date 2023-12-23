const express = require('express');
const router = express.Router();
const Vendor = require('../../models/Vendor Schema');
const Ingredient = require('../../models/Ingredient Schema');

//get all the vendors
router.get('/vendors', async (req, res) => {
    try {
      const unblockedVendors = await Vendor.find({ isBlocked: false });
      res.status(200).json(unblockedVendors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

//get the ingredients for every vendor
router.get('/vendors-with-ingredients', async (req, res) => {
    try {
      const vendors = await Vendor.find(); //get all vendors
      const vendorsWithIngredients = [];
  
      for (const vendor of vendors) {
        const ingredients = await Ingredient.find({ vendor: vendor._id }); //find ingredients for each vendor
        vendorsWithIngredients.push({
          vendor: vendor,
          ingredients: ingredients,
        });
      }
  
      res.status(200).json(vendorsWithIngredients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
module.exports = router;