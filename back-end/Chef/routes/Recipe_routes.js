const express = require('express');
const router = express.Router();
const autheticateToken = require('../../TokenAuthentication/token_authentication');
const Recipe = require('../../models/Recipe Schema');
const User_Notification = require('../../models/User_Notification Schema');
const Chef = require('../../models/Chef Schema'); 
const multer = require('multer');


// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });


//create new recipe
router.post('/newRecipe', autheticateToken, upload.single('recipeImage'),  async (req, res) =>{
    
    try{
        const { title, calories, servingSize, difficulty, totalTime, ingredients, allergens, notDelivered, utensils, category} = req.body;
        const chefId = req.user._id;
        const { recipeImage } = req.files;

        //create a new recipe
        const newRecipe = new Recipe({
            title,
            calories,
            servingSize,
            difficulty,
            totalTime,
            ingredients,
            allergens, 
            notDelivered,
            utensils,
            category,
            recipeImage: {
                data: recipeImage[0].buffer,
                contentType: recipeImage[0].mimetype
            },
            chef: chefId
        });

        const savedRecipe = await newRecipe.save();
        

        //make and add a notification to the followers of this chef that a new recipe is added

        //getting the followers of that chef
        const creatorChef = await Chef.findById(chefId).populate('followers');
        const followers = creatorChef.followers;

        //create notifications for all followers 
        const notificationPromises = followers.map(async (follower) =>{

            const follower_notification = new User_Notification({
                user: follower._id,
                type: 'New Recipe Added',
                notification_text: `Chef ${creatorChef.name} added a new recipe: ${savedRecipe.title}`,
                Time: Date.now(),

            });
            await follower_notification.save();
        });

        await Promise.all(notificationPromises);

        res.status(201).json(savedRecipe);

    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

});


//update a recipe



//delete a recipe


//get a recipe by id


//get all recipes with pagination and filtering 


//get all my recipes (person who is logged in)






