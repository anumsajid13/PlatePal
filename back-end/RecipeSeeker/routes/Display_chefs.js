const express = require('express');
const router = express.Router();
const Chef = require('../../models/Chef Schema');
const { Binary } = require('mongodb');

// Route to get all chefs with name and profile image
router.get('/allChefs', async (req, res) => {
    try {
      const chefs = await Chef.find({}, 'name profilePicture');
  
      const chefsWithBase64Image = chefs.map((chef) => {
        if (chef.profilePicture && typeof chef.profilePicture === 'object') {
          const base64String = Buffer.from(chef.profilePicture.data.buffer).toString('base64');
          return {
            _id: chef._id,
            name: chef.name,
            profilePicture: `data:${chef.profilePicture.contentType};base64,${base64String}`,
          };
        } else {
          return {
            _id: chef._id,
            name: chef.name,
            profilePicture: chef.profilePicture ? chef.profilePicture.toString('base64') : null,
          };
        }
      });
  
      res.status(200).json({ chefs: chefsWithBase64Image });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  

module.exports = router;
