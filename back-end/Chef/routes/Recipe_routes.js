const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const Recipe = require('../../models/Recipe Schema');
const User_Notification = require('../../models/User_Notification Schema');
const Chef = require('../../models/Chef Schema'); 
const multer = require('multer');


// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });


//create new recipe
router.post('/newRecipe', authenticateToken, upload.single('recipeImage'),  async (req, res) =>{
    
    try{
        const { title, calories, servingSize, difficulty, totalTime, ingredients, allergens, notDelivered, utensils, category, instructions } = req.body;
        const chefId = req.user.id;

        console.log(chefId)
        //handle the uploaded file
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

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
            instructions,
            recipeImage: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            },
            chef: chefId
        });


        const savedRecipe = await newRecipe.save();
        

        //make and add a notification to the followers of this chef that a new recipe is added

        //getting the followers of that chef
        const creatorChef = await Chef.findById(chefId).populate('followers');
        const followers = creatorChef.followers;

        if (followers.length > 0){
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
        }
        res.status(201).json(savedRecipe);

    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

});


//update a recipe
router.put('update/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;
    try {
      const updatedRecipe  = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
    
      return res.status(200).json('Profile updated successfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Failed to update recipe' });
    }
});


//delete a recipe
router.delete('delete/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;
    try {
        await Recipe.findByIdAndDelete(id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete recipe' });
    }
}); 

//get a recipe by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const recipe = await Recipe.findById(id);
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recipe' });
    }
});

//get all my recipes (person who is logged in)
router.get('/myrecipes', authenticateToken,  async (req, res) => {
    const loggedInUserId = req.user.id; 
    try {
      const userRecipes = await Recipe.find({ chef: loggedInUserId });
      res.json(userRecipes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user recipes' });
    }
});


module.exports = router;


