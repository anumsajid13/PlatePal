const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const Nutritionist = require('../../models/Nutritionist Schema');
const autheticateToken = require('../../TokenAuthentication/token_authentication');

  // Endpoint to get list of registered chefs
  router.get('/admin/list-registered-chefs', autheticateToken, async (req, res) => {
    try {
      // Fetch all registered chefs
      const registeredChefs = await Chef.find({ isBlocked: false });
  
      return res.json({ registeredChefs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of blocked chefs
  router.get('/admin/list-blocked-chefs', autheticateToken, async (req, res) => {
    try {
      // Fetch all blocked chefs
      const blockedChefs = await Chef.find({ isBlocked: true });
  
      return res.json({ blockedChefs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of registered vendors
  router.get('/admin/list-registered-vendors', autheticateToken, async (req, res) => {
    try {
      // Fetch all registered vendors
      const registeredVendors = await Vendor.find({ isBlocked: false });
  
      return res.json({ registeredVendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of blocked vendors
  router.get('/admin/list-blocked-vendors', autheticateToken, async (req, res) => {
    try {
      // Fetch all blocked vendors
      const blockedVendors = await Vendor.find({ isBlocked: true });
  
      return res.json({ blockedVendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of registered nutritionists
  router.get('/admin/list-registered-nutritionists', autheticateToken, async (req, res) => {
    try {
      // Fetch all registered nutritionists
      const registeredNutritionists = await Nutritionist.find({ isBlocked: false });
  
      return res.json({ registeredNutritionists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to get list of blocked nutritionists
  router.get('/admin/list-blocked-nutritionists', autheticateToken, async (req, res) => {
    try {
      // Fetch all blocked nutritionists
      const blockedNutritionists = await Nutritionist.find({ isBlocked: true });
  
      return res.json({ blockedNutritionists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;
