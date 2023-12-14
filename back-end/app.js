const Admin = require('./models/Admin Schema');
const Chef = require('./models/Chef Schema');
const ChefBlockReport = require('./models/ChefBlockReport Schema');
const CollaborationRequest = require('./models/CollaborationRequest Schema');
const Comment = require('./models/Comment Schema');
const Ingredient = require('./models/Ingredient Schema');
const User_Notification = require('./models/User_Notification Schema');//recipie seeker
const Admin_Notification = require('./models/Admin_Notification Schema');
const Chef_Notification = require('./models/Chef_Notification Schema');
const Nutritionist_Notification = require('./models/Nutritionist_Notification Schema');
const Vendor_Notification = require('./models/Vendor_Notification Schema');
const Nutritionist = require('./models/Nutritionist Schema');
const NutritionistBlockReport = require('./models/NutritionistBlockReport Schema');
const Order = require('./models/Order Schema');
const Rating = require('./models/Rating Schema');
const Recipe = require('./models/Recipe Schema');
const RecipeSeeker = require('./models/RecipeSeekerSchema');
const User_Chef_Inbox = require('./models/User-Chef_Inbox Schema');
const User_Nutritionist_Inbox = require('./models/User-Nutritionist_Inbox Schema');
const Vendor = require('./models/Vendor Schema');
const VendorBlockReport = require('./models/VendorBlockReport Schema');
const VendorCollaboration = require('./models/VendorCollaboration Schema');


//app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 9000;
const cors = require('cors');
//const DB= require('./models')
app.use(cors());


app.use(express.json());


// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/PlatePal', { useNewUrlParser: true });
const con = mongoose.connection;
con.on('open', () => {
    console.log('Connected to MongoDB');
});


//chefModule Routes
app.use('/chef', chefLoginSignUp);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
