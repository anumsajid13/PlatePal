
const express = require('express');
const router = express.Router();
const Chef = require('../../models/Chef Schema');
const autheticateToken = require('../../TokenAuthentication/token_authentication');

const Nutritionist = require('../../models/Nutritionist Schema');

const fs = require('fs');


// Endpoint to view certification pictures of nutritionists
router.get('/view-certifications', autheticateToken, async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({ allowSignup: false }, 'name certificationImage');

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
    const chefs = await Chef.find({ allowSignup: false }, 'name certificationImage');

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

    chef.allowSignup = allowSignup;
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



// Endpoint to change the boolean value to allow nutritionists to sign up
router.put('/allow-nutritionist-signup/:nutritionistId', autheticateToken, async (req, res) => {
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