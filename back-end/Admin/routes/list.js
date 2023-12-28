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
      .select('username email blockCount profilePicture');

       // Convert profilePicture to base64
    const chefsWithBase64Image = registeredChefs.map((chef) => {
      if (chef.profilePicture) {
        const uint8Array = new Uint8Array(chef.profilePicture.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...chef.toObject(),
          profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
        };
      }
      return chef.toObject();
    });

    return res.json(chefsWithBase64Image);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get list of all chefs with name, blockCount, and profilePicture
router.get('/list-all-chefs', async (req, res) => {
  try {
    // Fetch name, blockCount, and profilePicture of all chefs
    const allChefs = await Chef.find({}, { username: 1, blockCount: 1, profilePicture: 1, _id: 1 });

    // Convert profilePicture to base64
    const chefsWithBase64Image = allChefs.map((chef) => {
      if (chef.profilePicture) {
        const uint8Array = new Uint8Array(chef.profilePicture.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...chef.toObject(),
          profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
        };
      }
      return chef.toObject();
    });

    return res.json(chefsWithBase64Image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get list of all nutritionists with username, blockCount, and profilePicture
router.get('/list-all-nutritionists', async (req, res) => {
  try {
    // Fetch username, blockCount, and profilePicture of all nutritionists
    const allNutritionists = await Nutritionist.find({}, { username: 1, blockCount: 1, profilePicture: 1, _id: 1 });

    // Convert profilePicture to base64
    const nutritionistsWithBase64Image = allNutritionists.map((nutritionist) => {
      if (nutritionist.profilePicture) {
        const uint8Array = new Uint8Array(nutritionist.profilePicture.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...nutritionist.toObject(),
          profilePicture: { data: base64ImageData, contentType: nutritionist.profilePicture.contentType },
        };
      }
      return nutritionist.toObject();
    });

    return res.json(nutritionistsWithBase64Image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get list of all vendors with username, blockCount, and profilePicture
router.get('/list-all-vendors', async (req, res) => {
  try {
    // Fetch username, blockCount, and profilePicture of all vendors
    const allVendors = await Vendor.find({}, { username: 1, blockCount: 1, profilePicture: 1, _id: 1 });

    // Convert profilePicture to base64
    const vendorsWithBase64Image = allVendors.map((vendor) => {
      if (vendor.profilePicture) {
        const uint8Array = new Uint8Array(vendor.profilePicture.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...vendor.toObject(),
          profilePicture: { data: base64ImageData, contentType: vendor.profilePicture.contentType },
        };
      }
      return vendor.toObject();
    });

    return res.json(vendorsWithBase64Image);
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
      .select('username email profilePicture');

       // Convert profilePicture to base64
    const chefsWithBase64Image = registeredVendors.map((chef) => {
      if (chef.profilePicture) {
        const uint8Array = new Uint8Array(chef.profilePicture.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...chef.toObject(),
          profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
        };
      }
      return chef.toObject();
    });

    return res.json(chefsWithBase64Image);

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
        .select('username email profilePicture');

         // Convert profilePicture to base64
    const chefsWithBase64Image = registeredNutritionists.map((chef) => {
      if (chef.profilePicture) {
        const uint8Array = new Uint8Array(chef.profilePicture.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...chef.toObject(),
          profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
        };
      }
      return chef.toObject();
    });

    return res.json(chefsWithBase64Image);

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
      const blockedNutritionists = await Nutritionist.find({ isBlocked: true })
      .select('username email blockCount profilePicture');

      // Convert profilePicture to base64
   const chefsWithBase64Image = blockedNutritionists.map((chef) => {
     if (chef.profilePicture) {
       const uint8Array = new Uint8Array(chef.profilePicture.data);
       const base64ImageData = Buffer.from(uint8Array).toString('base64');
       return {
         ...chef.toObject(),
         profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
       };
     }
     return chef.toObject();
   });

   return res.json(chefsWithBase64Image);

      } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Endpoint to get list of blocked chefs
router.get('/list-blocked-chefs', autheticateToken,async (req, res) => {
  try {
    // Fetch only selected fields for blocked chefs
    const blockedChefs = await Chef.find({ isBlocked: true })
    .select('username email blockCount profilePicture');

    // Convert profilePicture to base64
 const chefsWithBase64Image = blockedChefs.map((chef) => {
   if (chef.profilePicture) {
     const uint8Array = new Uint8Array(chef.profilePicture.data);
     const base64ImageData = Buffer.from(uint8Array).toString('base64');
     return {
       ...chef.toObject(),
       profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
     };
   }
   return chef.toObject();
 });

 return res.json(chefsWithBase64Image);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Endpoint to get list of blocked vendors
  router.get('/list-blocked-vendors', autheticateToken, async (req, res) => {
    try {
      // Fetch all blocked vendors
      const blockedVendors = await Vendor.find({ isBlocked: true })
      .select('username email blockCount profilePicture');

      // Convert profilePicture to base64
   const chefsWithBase64Image = blockedVendors.map((chef) => {
     if (chef.profilePicture) {
       const uint8Array = new Uint8Array(chef.profilePicture.data);
       const base64ImageData = Buffer.from(uint8Array).toString('base64');
       return {
         ...chef.toObject(),
         profilePicture: { data: base64ImageData, contentType: chef.profilePicture.contentType },
       };
     }
     return chef.toObject();
   });

   return res.json(chefsWithBase64Image);

      } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;
