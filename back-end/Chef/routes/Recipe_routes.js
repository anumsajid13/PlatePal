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
          const { title, calories, servingSize, difficulty, totalTime, ingredients, allergens, notDelivered, utensils, category, instructions, description } = req.body;
          const chefId = req.user.id;


          //handle the uploaded file
          if (!req.file) {
              return res.status(400).json({ message: 'No file uploaded' });
          }

          //create a new recipe
          const newRecipe = new Recipe({
              title:title.replace(/\D/g, ''),
              calories:parseInt(calories.replace(/\D/g, ''), 10),
              servingSize:parseInt(servingSize.replace(/\D/g, ''), 10),
              difficulty:difficulty.replace(/\D/g, ''),
              totalTime:parseInt(totalTime.replace(/\D/g, ''), 10),
              ingredients:ingredients.replace(/\D/g, ''),
              allergens:allergens.replace(/\D/g, ''), 
              notDelivered:notDelivered.replace(/\D/g, ''),
              utensils:utensils.replace(/\D/g, ''),
              category:category.replace(/\D/g, ''),
              instructions:instructions.replace(/\D/g, ''),
              recipeImage: {
              data: req.file.buffer,
              contentType: req.file.mimetype,
              },
              chef: chefId,
              description:description.replace(/\D/g, ''),
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

//get all my recipes where there is a vendor collab like its postedd (person who is logged in)
router.get('/myrecipes', authenticateToken,  async (req, res) => {
    const loggedInUserId = req.user.id; 
    try {
        const userRecipesWithVendor = await Recipe.find({
            chef: loggedInUserId,
            vendor: { $exists: true, $ne: null } //filtering for recipes with a vendor
          });
          res.json(userRecipesWithVendor);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user recipes' });
    }
});

//get all my recipes where there is no vendor collab like its not postedd yett (person who is logged in)
router.get('/myrecipes', authenticateToken,  async (req, res) => {
    const loggedInUserId = req.user.id; 
    try {
        const userRecipesWithoutVendor = await Recipe.find({
            chef: loggedInUserId,
            vendor: { $exists: true, $eq: null } //filtering for recipes without a vendor
          });
          res.json(userRecipesWithoutVendor);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user recipes' });
    }
});


module.exports = router;


