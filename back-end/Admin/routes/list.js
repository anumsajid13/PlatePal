const Chef = require('../../models/Chef Schema');
const Vendor = require('../../models/Vendor Schema');
const Nutritionist = require('../../models/Nutritionist Schema');
const autheticateToken = require('../../TokenAuthentication/token_authentication');
const express = require('express');
const router = express.Router();


/////////////REGISTERED///////////////
 // Endpoint to get list of registered chefs
router.get('/list-registered-chefs',  async (req, res) => {
  try {
    // Fetch only selected fields for registered chefs
    const registeredChefs = await Chef.find({ isBlocked: false })
      .select('username email blockCount ');

    return res.json(registeredChefs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get list of all chefs with name and blockCount
router.get('/list-all-chefs',  async (req, res) => {
  try {
    // Fetch only the name and blockCount of all chefs
    const allChefs = await Chef.find({}, { username: 1, blockCount: 1, _id: 1 });

    return res.json( allChefs );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Endpoint to get list of all nutritionists with username and blockCount
router.get('/list-all-nutritionists',  async (req, res) => {
  try {
    // Fetch only the username and blockCount of all nutritionists
    const allNutritionists = await Nutritionist.find({}, { username: 1, blockCount: 1, _id: 1 });

    return res.json(allNutritionists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get list of all vendors with username and blockCount
router.get('/list-all-vendors',  async (req, res) => {
  try {
    // Fetch only the username and blockCount of all vendors
    const allVendors = await Vendor.find({}, { username: 1, blockCount: 1, _id: 1 });

    return res.json(allVendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  // Endpoint to get list of registered vendors
  router.get('/list-registered-vendors', autheticateToken, async (req, res) => {
    try {
      // Fetch all registered vendors
      const registeredVendors = await Vendor.find({ isBlocked: false })
      .select('username email ');

      return res.json( registeredVendors );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
    // Endpoint to get list of registered nutritionists
    router.get('/list-registered-nutritionists', autheticateToken, async (req, res) => {
      try {
        // Fetch all registered nutritionists
        const registeredNutritionists = await Nutritionist.find({ isBlocked: false })
        .select('username email ');

        return res.json( registeredNutritionists );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

  
///////////////////////////BLOCKED///////////////
  
  // Endpoint to get list of blocked nutritionists
  router.get('/list-blocked-nutritionists', autheticateToken, async (req, res) => {
    try {
      // Fetch all blocked nutritionists
      const blockedNutritionists = await Nutritionist.find({ isBlocked: true });
  
      return res.json(blockedNutritionists );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Endpoint to get list of blocked chefs
router.get('/list-blocked-chefs', autheticateToken,async (req, res) => {
  try {
    // Fetch only selected fields for blocked chefs
    const blockedChefs = await Chef.find({ isBlocked: true });

    return res.json(blockedChefs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Endpoint to get list of blocked vendors
  router.get('/list-blocked-vendors', autheticateToken, async (req, res) => {
    try {
      // Fetch all blocked vendors
      const blockedVendors = await Vendor.find({ isBlocked: true });
  
      return res.json(blockedVendors );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;
