const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Nutritionist = require('../../models/Nutritionist Schema');

//get all the names of the followers (recipe seekers) of the chef logged in 
router.get('/myfollowers', authenticateToken, async (req, res) => {

    const chefId = req.user.id;
    try {
    
      //check if the chef exists
      const chef = await Nutritionist.findById(chefId);

      if (!chef) {
        return res.status(404).json({ message: 'Nutrionist not found' });
      }
  
      //populate the followers array with Recipe Seekers documents and retrieve their names
      await chef.populate({
        path: 'followers',
        select: 'name profilePicture', //select the 'name' field of the Recipe Seeker documents

      });

      // Retrieve followers' data including names and profile pictures
      const followersWithNamesAndPictures = chef.followers.map(follower => ({
        _id: follower._id,
        name: follower.name,
        profilePicture: follower.profilePicture
          ? `data:${follower.profilePicture.contentType};base64,${follower.profilePicture.data.toString('base64')}`
          : null,
      }));
  
      res.status(200).json({ followers: followersWithNamesAndPictures });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  module.exports = router;