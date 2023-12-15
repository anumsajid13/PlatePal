const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const vendor = require('../../models/Vendor Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const router = express.Router();
require('dotenv').config();
 

//register as new vendor
router.post("/register", async (req, res) => {
    try {
      const { name,username, email, password } = req.body;
      if (!(email && password && name && username)) {
        return res.status(400).send({ error: "All input is required" });
      }
     //checking if user already exists
      const oldUser = await vendor.findOne({ email });
      if (oldUser) {
        return res.status(409).send({ error: "User Already Exist. Please Login" });
      }
      //encrypting password
      const Password = await bcrypt.hash(password, 10);
      const user = new vendor({ name:name, username:username,email:email, password:Password});
      await user.save();
  
      return res.status(200).send('User registered successfully');
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
 
 // login route
 router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!(email && password)) {
      res.status(400).send("All input is required");
      return;
    }
  
    try {
    //checking if user exists
      const user = await User.findOne({ email });
      if(!user){
        return res.status(401).send("Invalid email.");
      }
      //checking if password is correct
      const validpass=await bcrypt.compare(password, user.password);
      if(!validpass){
        return res.status(401).send("Invalid password.");
      }
      //checking if user is active
        if (user.isActive) {
          // Create token
          const token = jwt.sign(
            {id:user.id,email:user.email, name:user.name},
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          // Assign token to the user and save back to the database
          user.token = token;
          await user.save();
          return res.status(200).send({user, message: "Successful login"});
          //res.status(200).json({ token });//returning token

        } else {
          return res.status(403).send('Access denied - you were blocked by the admin');
        }
      } 
    catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

  //edit profile
  router.put('/editprofile', authenticateToken, async (req, res) => {
    try {
      const updatedUser = await vendor.findByIdAndUpdate(req.user.id, req.body, { new: true });
      if(!updatedUser){
        return res.status(401).send("Invalid email.");
      }
      await updatedUser.save();
      return res.status(200).send('Profile updated successfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

  //delete profile
  router.delete('/deleteprofile', authenticateToken, async (req, res) => {
    try {
      const deletedUser = await vendor.findByIdAndDelete(req.user.id);
      if(!deletedUser){
        return res.status(401).send("Invalid email.");
      }
      return res.status(200).send('Profile deleted successfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });
  