
const express = require('express');
const router = express.Router();
const Chef = require('../../models/Chef Schema');
const autheticateToken = require('../../TokenAuthentication/token_authentication');

const Nutritionist = require('../../models/Nutritionist Schema');
const Vendor = require('../../models/Vendor Schema');

const fs = require('fs');


// Endpoint to view certification pictures of nutritionists
router.get('/view-certifications', autheticateToken, async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({ allowSignup: false }, 'name certificationImage _id');

    const nutritionistsWithBase64PDFs = nutritionists.map((nutritionist) => {
      const certificationDocument = nutritionist.certificationImage;
      const dataBuffer = certificationDocument.data;
      const base64Data = dataBuffer ? Buffer.from(dataBuffer).toString('base64') : '';

      return {
        ...nutritionist.toObject(),
        certificationImage: {
          data: base64Data,
          contentType: certificationDocument.contentType,
        },
      };
    });

    return res.json({ nutritionists: nutritionistsWithBase64PDFs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to view certification pictures of chefs
router.get('/view-chef-certifications', autheticateToken, async (req, res) => {
  try {
    const chefs = await Chef.find({ allowSignup: false }, 'name certificationImage _id');

    const chefsWithBase64PDFs = chefs.map((chef) => {
      const certificationDocument = chef.certificationImage;
      const dataBuffer = certificationDocument.data;
      const base64Data = dataBuffer ? Buffer.from(dataBuffer).toString('base64') : '';

      return {
        ...chef.toObject(),
        certificationImage: {
          data: base64Data,
          contentType: certificationDocument.contentType,
        },
      };
    });

    return res.json({ chefs: chefsWithBase64PDFs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to change the boolean value to allow chefs to sign up
router.put('/allow-chef-signup/:chefId', autheticateToken, async (req, res) => {
  try {
    const { allowSignup } = req.body;
    const chef = await Chef.findById(req.params.chefId);

    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    chef.allowSignup = true;
    await chef.save();

    const message = allowSignup
      ? 'Allow chef signup status updated successfully'
      : 'Chef signup is currently not allowed';

    return res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to change the boolean value to disallow chefs to sign up and delete the user
router.delete('/disallow-chef-signup/:chefId', autheticateToken, async (req, res) => {
  try {
    const chefId = req.params.chefId;

    // Find the chef by ID
    const chef = await Chef.findByIdAndDelete(chefId);

    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }
    return res.json({ message: 'Chef signup disallowed, and the chef user deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to change the boolean value to allow nutritionists to sign up
router.put('/allow-nutritionist-signup/:nutritionistId', autheticateToken, async (req, res) => {
  try {
    const { allowSignup } = req.body;
    const nutritionist = await Nutritionist.findById(req.params.nutritionistId);

    if (!nutritionist) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }

    nutritionist.allowSignup = true;
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


// Endpoint to change the boolean value to disallow nutritionists to sign up and delete the user
router.delete('/disallow-nutritionist-signup/:nutritionistId', autheticateToken, async (req, res) => {
  try {
    const nutritionistId = req.params.nutritionistId;

    // Find the nutritionist by ID and delete
    const nutritionist = await Nutritionist.findByIdAndDelete(nutritionistId);

    if (!nutritionist) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }

    return res.json({ message: 'Nutritionist signup disallowed, and the nutritionist user deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to view certification pictures of vendors
router.get('/view-vendor-certifications', autheticateToken, async (req, res) => {
  try {
    const vendors = await Vendor.find({ allowSignup: false }, 'name certificationImage _id');

    const vendorsWithBase64PDFs = vendors.map((vendor) => {
      const certificationDocument = vendor.certificationImage;
      const dataBuffer = certificationDocument.data;
      const base64Data = dataBuffer ? Buffer.from(dataBuffer).toString('base64') : '';

      return {
        ...vendor.toObject(),
        certificationImage: {
          data: base64Data,
          contentType: certificationDocument.contentType,
        },
      };
    });

    return res.json({ vendors: vendorsWithBase64PDFs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to allow or disallow vendors to sign up
router.put('/allow-vendor-signup/:vendorId', autheticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    vendor.allowSignup = true;
    await vendor.save();
   
    const message = 'Vendor signup allowed successfully';

    return res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to disallow vendors to sign up and delete the user
router.delete('/disallow-vendor-signup/:vendorId', autheticateToken, async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // Find the vendor by ID
    const vendor = await Vendor.findByIdAndDelete(vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    return res.json({ message: 'Vendor signup disallowed, and the vendor user deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  module.exports=router;