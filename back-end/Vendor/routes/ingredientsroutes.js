const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const vendor = require('../../models/Vendor Schema');
const router = express.Router();
require('dotenv').config();
 

//Add a new ingredient
router.post('/new', async (req, res) => {
    try {
        const { title, description, authorid, category } = req.body;
    if (!title || !description || !category) //validating all fields are filled
    {  
      return res.status(400).json({ message: 'All input fields are not filled.' });
    }
    const newPost = new Blog({ title, description, authorid, category });     //creating new post
      await newPost.save();       //saving the post
     return res.status(201).send(newPost);
     //res.status(200).json({ message: 'Blog post was uploaded!', id: savedBlog._id });
    } catch (error) {
      return res.status(400).send(error);
      //res.status(200).json({ message: 'Error occurred, please tryagain' });
    }
  });

  //update an existing ingredient

  //delete an existing ingredient

  