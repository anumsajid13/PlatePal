const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Chef = require('../../models/Chef Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication')
require('dotenv').config();
const multer = require('multer');
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

router.post('/signup', upload.fields([ { name: 'certificationImage', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
    const { name, username, email, password } = req.body;
    const { profilePicture, certificationImage } = req.files;
  
    try {

      //check if all fields are not filled
      if (!(name && username && email && password )) {
            return res.status(400).json({ message:'All fields are not provided'});
      }

      //check if the username or email already exists
      const existingChef = await Chef.findOne({ $or: [{ username }, { email }] });
      if (existingChef) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      //hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newChef = new Chef({
        name,
        username,
        email,
        password: hashedPassword,
        profilePicture: {
          data: profilePicture[0].buffer,
          contentType: profilePicture[0].mimetype
        },
        certificationImage: {
          data: certificationImage[0].buffer,
          contentType: certificationImage[0].mimetype
        }
      });
  
      //save the new Chef 
      await newChef.save();
  
      res.status(201).json({ message: 'Your sign up request sent to admin!' });
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

router.post('/login', async (req,res) => {
    const { username, password } = req.body;

    try{

      
        //find chef by email
        const chef = await Chef.findOne({username});

        if(!chef){
            return res.status(404).json({ message: 'Chef not found' });
        }

        
        if(chef.allowSignup && !chef.isBlocked){

          const passwordMatch = await bcrypt.compare(password, chef.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
          //getting token using jwt
        const token = jwt.sign({ id: chef._id, username: chef.username, email: chef.email, name: chef.name}, process.env.SECRET_KEY);

         return res.status(200).json({ token });
       }

        if (!chef.allowSignup) {
          return res.status(403).json({ message: 'Admin is reviewing your certificate' });
        }
      
        if (chef.isBlocked) {
          return res.status(403).json({ message:'Access denied - you were blocked by the admin'});
      }

    }
    catch (error) {
        
        res.status(500).json({ message: 'Server Error' });

    }

});

//get a chef by id
router.get('/get', authenticateToken, async (req, res) => {

  const id  = req.user.id;
  try {
    const chef = await Chef.findById(id);
  
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Convert the image buffer to a Base64 string
    const unit8Array = new Uint8Array(chef.profilePicture.data);
    const base64string = Buffer.from(unit8Array).toString('base64');
    
    const chefDataWithBase64Image = { ...chef._doc, profilePicture: base64string };

    return res.status(200).json(chefDataWithBase64Image);
   
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Failed to fetch  chef' });
  }
});

//update profile
router.put('/update', upload.single('profilePicture'), authenticateToken, async (req, res) => {
  const id = req.user.id;
  const { password, newPassword, ...otherUpdates } = req.body;
  const ProfilePicture = req.file; 
  try {
    const chef = await Chef.findById(id);

    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }


  if (ProfilePicture !== undefined || ProfilePicture !== null) {
      
      chef.profilePicture.data = ProfilePicture.buffer; 
      chef.profilePicture.contentType = ProfilePicture.mimetype;
  }

  if(password && newPassword){

    const passwordMatch = await bcrypt.compare(password, chef.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    chef.password = hashedNewPassword;
    
  }
     // Only update other fields if they exist in the request body
     if (Object.keys(otherUpdates).length > 0) {
      Object.assign(chef, otherUpdates);
    }

    const updatedChef = await chef.save();

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

//delete profile
router.delete('/delete', authenticateToken, async (req, res) => {

  const  id  = req.user.id;
  try {
      await Chef.findByIdAndDelete(id);
      res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete profile' });
  }
}); 

module.exports = router;