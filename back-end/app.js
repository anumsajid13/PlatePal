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
app.use(express.json({ limit: '50mb' }));
//const DB= require('./models')
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.json());


// Connecting to MongoDB
mongoose.connect('mongodb+srv://anumsajid13:6grTh91EsFrpMXSl@cluster0.lzdbmp9.mongodb.net/PlatePal', { useNewUrlParser: true });
const con = mongoose.connection;
con.on('open', () => {
    console.log('Connected to MongoDB');
});

const chefLoginSignUp = require('./Chef/routes/ChefModule_routes')
const User_Signin = require('./RecipeSeeker/routes/signin_route')
const User_SignUp = require('./RecipeSeeker/routes/signup_route')
const Dicover_recepies = require('./RecipeSeeker/routes/Discover_Recepies')
const Rate_recepies = require('./RecipeSeeker/routes/Rate_Recepie')
const DisplayRatings = require('./RecipeSeeker/routes/DisplayRatings')
const Comment_Recipie = require('./RecipeSeeker/routes/Comment')
const Comment_Display = require('./RecipeSeeker/routes/Display_comments')
const Follow_chef = require('./RecipeSeeker/routes/FollowChef')
const UnFollow_chef = require('./RecipeSeeker/routes/UnFollow_Chef')
const Display_followings = require('./RecipeSeeker/routes/DisplayFollowings')
const Display_Chefs = require('./RecipeSeeker/routes/Display_chefs')
const Display_Nutritionists = require('./RecipeSeeker/routes/Display_Nutritionists')
const Text_Chef = require('./RecipeSeeker/routes/Send_msgToChef')
const Display_TextwithChef = require('./RecipeSeeker/routes/Display_chef_chats')
const Send_notification_to_nutritionist = require('./RecipeSeeker/routes/Send_noti_to_Nutri')
const Reipe_routes = require('./Chef/routes/Recipe_routes');

const admin_signin = require('./Admin/routes/login');
const block = require('./Admin/routes/block');
const list_chef = require('./Admin/routes/list');

const admin_Notification = require('./Admin/routes/Notifications');
const top = require('./Admin/routes/top');


const vendor_Routes = require('./Vendor/routes/profileRoute');
const ingredient_Routes = require('./Vendor/routes/ingredients_routes');
const collaboration_Routes = require('./Vendor/routes/collaborationroute');
const collaboration_Request= require('./Vendor/routes/collabRequest');

const blockreportroVendorRoutes = require('./Chef/routes/blockReport_Routes');



const Nutritionist_Signin = require('./Nutrionist/routes/login-n')
const Nutritionist_Plan = require('./Nutrionist/routes/plan')

const getAllVendors = require('./Chef/routes/vendor_Routes_Chef');
const collabVendorsChef = require('./Chef/routes/CollabVendors_routes');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
const chefnotifications = require('./Chef/routes/Notification_routes');
const cheffollowerss = require('./Chef/routes/DisplayFollowers_routes');
//chefModule Routes
app.use('/chef', chefLoginSignUp);
app.use('/chef', chefnotifications);
app.use('/chef', cheffollowerss);
//recepie seeker routes
app.use('/recepieSeeker', User_Signin); 
app.use('/recepieSeeker', User_SignUp);
app.use('/recepieSeeker', Dicover_recepies);
app.use('/recepieSeeker', Rate_recepies);
app.use('/recepieSeeker', DisplayRatings);
app.use('/recepieSeeker', Comment_Recipie);
app.use('/recepieSeeker', Comment_Display);
app.use('/recepieSeeker', Follow_chef);
app.use('/recepieSeeker', UnFollow_chef);
app.use('/recepieSeeker', Display_followings);
app.use('/recepieSeeker', Display_Chefs);
app.use('/recepieSeeker', Text_Chef);
app.use('/recepieSeeker', Display_TextwithChef);
app.use('/recepieSeeker', Display_Nutritionists);
app.use('/recepieSeeker', Send_notification_to_nutritionist);
//recipe routes
app.use('/recipes', Reipe_routes);

//admin routes
app.use('/admin', admin_signin);
app.use('/admin', block);
app.use('/admin', admin_Notification);
app.use('/admin', top);
app.use('/admin', list_chef);


//Vendor routes
app.use('/vendor', vendor_Routes);
app.use('/ingredients', ingredient_Routes);
app.use('/collaboration',collaboration_Routes);
app.use('/collaboration-request',collaboration_Request);

//block report by chef
app.use('/chef', blockreportroVendorRoutes);
//get all vendors (chef)
app.use('/vendors_chef', getAllVendors);
//collab routes
app.use('/chefVendors', collabVendorsChef);

//nutri routes
app.use('/n', Nutritionist_Signin); 
app.use('/n', Nutritionist_Plan); 


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
