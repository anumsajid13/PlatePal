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
          const { title, calories, servingSize, difficulty, totalTime, ingredients, allergens, notDelivered, utensils, category, instructions, description, price } = req.body;
          const chefId = req.user.id;


          //handle the uploaded file
          if (!req.file) {
              return res.status(400).json({ message: 'No file uploaded' });
          }

          //create a new recipe
          const newRecipe = new Recipe({
              title,
              calories:parseInt(calories.replace(/\D/g, ''), 10),
              servingSize:parseInt(servingSize.replace(/\D/g, ''), 10),
              difficulty,
              totalTime:parseInt(totalTime.replace(/\D/g, ''), 10),
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
              chef: chefId,
              description,
              price:parseInt(price.replace(/\D/g, ''), 10),
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

//udate recipe
  router.put('/update/:id', upload.single('recipeImage'), authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
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
        description,
        price
    } = req.body;
    const RecipeImage = req.file;

   
    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (RecipeImage !== undefined && RecipeImage !== null) {
            recipe.recipeImage.data = RecipeImage.buffer;
            recipe.recipeImage.contentType = RecipeImage.mimetype;
        }

        if (title !== undefined && title !== null) {
          recipe.title = title;
      }
      if (calories !== undefined && calories !== null) {
          recipe.calories = calories;
      }
      if (servingSize !== undefined && servingSize !== null) {
          recipe.servingSize = servingSize;
      }
      if (difficulty !== undefined && difficulty !== null) {
          recipe.difficulty = difficulty;
      }
      if (totalTime !== undefined && totalTime !== null) {
          recipe.totalTime = totalTime;
      }
      if (Array.isArray(ingredients) && ingredients.length > 0) {
          recipe.ingredients = ingredients;
      }
      if (Array.isArray(allergens) && allergens.length > 0) {
          recipe.allergens = allergens;
      }
      if (Array.isArray(notDelivered) && notDelivered.length > 0) {
          recipe.notDelivered = notDelivered;
      }
      if (Array.isArray(utensils) && utensils.length > 0) {
          recipe.utensils = utensils;
      }
      if (Array.isArray(category) && category.length > 0) {
          recipe.category = category;
      }
      if (Array.isArray(instructions) && instructions.length > 0) {
          recipe.instructions = instructions;
      }
      if (description !== undefined && description !== null) {
          recipe.description = description;
      }
      if (price !== undefined && price !== null) {
          recipe.price = parseInt(price.replace(/\D/g, ''), 10) || recipe.price;
      }

        const updated = await recipe.save();

        return res.status(200).json({ message: 'Recipe updated successfully', updated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update recipe' });
    }
});


//delete a recipe
router.delete('/delete/:id', authenticateToken, async (req, res) => {

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
router.get('/myrecipes/vendors', authenticateToken,  async (req, res) => {
    const loggedInUserId = req.user.id; 
    try {
        const userRecipesWithVendor = await Recipe.find({
            chef: loggedInUserId,
            vendor: { $exists: true, $ne: null } //filtering for recipes with a vendor
          }).populate('chef', 'name').populate({
            path: 'comments', 
            populate: {
                path: 'user', 
                select: 'name profilePicture', 
            },
            select: 'comment Time user', 
          }).populate({
            path: 'ratings',
            populate: {
              path: 'user', 
              select: 'name profilePicture', 
            },
            select: 'ratingNumber Time user',
           });

           //map over the recipes and append the chef's name from req.user and comments and user details
           const recipesWithChefName = userRecipesWithVendor.map(recipe => {
            const updatedRecipe = recipe.toObject();
            updatedRecipe.chefName = req.user.name; //append chefName to the recipe object
        
            //map comments and include comment, Time, and user fields within each comment
            updatedRecipe.comments = updatedRecipe.comments.map(comment => ({
                comment: comment.comment,
                Time: comment.Time,
                user: comment.user ? { name: comment.user.name} : null,
            }));
        
            updatedRecipe.ratings = updatedRecipe.ratings.map(rating => ({
              ratingNumber: rating.ratingNumber,
              Time: rating.Time,
              user: rating.user ? { name: rating.user.name} : null,
            }));
            return updatedRecipe;
        });
        

          res.json(recipesWithChefName);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user recipes' });
    }
});

//get all my recipes where there is no vendor collab like its not postedd yett (person who is logged in)
router.get('/myrecipes/noVendor', authenticateToken,  async (req, res) => {
    const loggedInUserId = req.user.id; 
    
    try {
        const userRecipesWithoutVendor = await Recipe.find({
            chef: loggedInUserId,
            $or: [{ vendor: { $exists: false } }, { vendor: null }], //filtering for recipes without a vendor
          }).populate('chef', 'name').populate('chef', 'name').populate({
            path: 'comments', 
            populate: {
                path: 'user', 
                select: 'name profilePicture', 
            },
            select: 'comment Time user', 
          }).populate({
            path: 'ratings',
            populate: {
              path: 'user', 
              select: 'name profilePicture', 
            },
            select: 'ratingNumber Time user',
           });

           //map over the recipes and append the chef's name from req.user and comments and user details
           const recipesWithChefs = userRecipesWithoutVendor.map(recipe => {
            const updatedRecipe = recipe.toObject();
            updatedRecipe.chefName = req.user.name; //append chefName to the recipe object
        
            //map comments and include comment, Time, and user fields within each comment
            updatedRecipe.comments = updatedRecipe.comments.map(comment => ({
                comment: comment.comment,
                Time: comment.Time,
                user: comment.user ? { name: comment.user.name} : null,
            }));

            updatedRecipe.ratings = updatedRecipe.ratings.map(rating => ({
              ratingNumber: rating.ratingNumber,
              Time: rating.Time,
              user: rating.user ? { name: rating.user.name} : null,
            }));

            return updatedRecipe;
            
            });
            
          
          
          res.json(recipesWithChefs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user recipes' });
    }
});

const apiUrl = 'https://food-nutrition-information.p.rapidapi.com/foods/search?query=';
const rapidApiKey = '5e1c3f2495msh77b53e70c808cc8p18cfc7jsn052ace546c72';

router.get('/:recipeId/fetch-nutrition', authenticateToken,  async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
  }

  if (recipe.Nutrients.length === 0) {
          const { ingredients } = recipe; 

          //fetch nutrition data for each ingredient
          const nutritionDataPromises = ingredients.map(async (ingredient) => {

            const ingredientName = encodeURIComponent(ingredient.name);
            const response = await fetch(apiUrl + ingredientName, {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'food-nutrition-information.p.rapidapi.com',
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch nutrition data');
            }

            const result = await response.json();

            if (result && result.status && result.status === 'failure') {
              
              console.log(`Ingredient '${ingredient.name}' not found in the API`);
              return null; //skipping this ingredient
            }

            return result; 
          });

          const nutritionData = await Promise.all(nutritionDataPromises);
          const totalNutrients = {};
          
         

      //loop through nutritionData to access foodNutrients for each ingredient
      nutritionData.filter((data) => data !== null).forEach((ingredientNutrition) => {
        if (ingredientNutrition.foods && ingredientNutrition.foods.length > 0) {
          const firstFood = ingredientNutrition.foods[0];
          if (firstFood && firstFood.foodNutrients) {
            const foodNutrients = firstFood.foodNutrients;

            //get top 7
            const sortedNutrients = foodNutrients.sort((a, b) => b.value - a.value).slice(0, 7);

            //add nutrient values for the entire recipe
            sortedNutrients.forEach((nutrient) => {
              const { nutrientName, value, unitName } = nutrient;

              //if we get the nutrient for the first time, initialize the total
              if (!totalNutrients[nutrientName]) {
                totalNutrients[nutrientName] = {
                  totalValue: 0,
                  unit: unitName, 
                };
              }

              //add the value to the total for that nutrient
              totalNutrients[nutrientName].totalValue += value;
            });
          }
        }
      });

      recipe.Nutrients = Object.keys(totalNutrients).map((nutrientName) => ({
        nutrientName,
        value: totalNutrients[nutrientName].totalValue,
        unitName: totalNutrients[nutrientName].unit,
      }));

      await recipe.save();
          
      res.status(200).json({ recipe });
  }
  else{
        res.status(200).json({ message: 'already has nutrients' });
  }
  } catch (error) {
    console.error('Error fetching and saving nutrition data:', error);
    res.status(500).json({ error: 'Error fetching and saving nutrition data' });
  }
});


module.exports = router;


