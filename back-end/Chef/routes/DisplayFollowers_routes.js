const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Chef = require('../../models/Chef Schema');

//get all the names of the followers (recipe seekers) of the chef logged in 
router.get('/myfollowers', authenticateToken, async (req, res) => {

    const chefId = req.user.id;
    try {
    
      //check if the chef exists
      const chef = await Chef.findById(chefId);

      if (!chef) {
        return res.status(404).json({ message: 'Chef not found' });
      }
  
      //populate the followers array with Recipe Seekers documents and retrieve their names
      await chef.populate({
        path: 'followers',
        select: 'name', //select the 'name' field of the Recipe Seeker documents
      });
  
      const followersWithNames = chef.followers;
  
      res.status(200).json({ followers: followersWithNames });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  module.exports = router;