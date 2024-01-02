const express = require('express');
const router = express.Router();
const Ingredient = require('../../models/Ingredient Schema');
const jwt = require("jsonwebtoken");
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const multer = require('multer');
// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });
// Endpoint to get all ingredients with filtering, sorting, and pagination
router.get('/All', authenticateToken, async (req, res) => {
  try {
    // Extract query parameters
    const { sortBy, sortOrder, filterType, filterValue, search } = req.query;
    const vendorId = req.user.id;

    // Build the query object
    const query = { vendor: vendorId }; // Filter by vendor ID
    if (filterType && filterValue) {
      if(filterType=='type')
      {
        query.type = filterValue;
      }
      if(filterType=='price')
      {
        query.price = filterValue;
      }
      if (filterType=='quantity') {
        query.quantity = filterValue;
      }
    }

   /*  if (filterType && filterValue) { //does the same as above but more generic if we have a lot of  filters
      query[filterType] = filterValue;
    } */
    if (search) {
      
      query.name = { $regex: new RegExp(search, 'i') }; // Case-insensitive search
    }

    const sortOptions = {};

    if (!sortBy) {
      sortOptions[sortBy] = 1;
    }

    if (sortBy ) {
      let sortvalue;
      if(!sortOrder || !sortBy)
      { 
        sortBy='Time';
        sortvalue=-1;
      }
      else if (sortOrder === 'desc') {
        sortvalue = -1; // desc
      } else if(sortOrder === 'asc') {
        sortvalue = 1; // sortorder=='lowest'
      }
  
      sortOptions[sortBy] = sortvalue;
    }


    // Fetch ingredients based on the query, sort, and pagination
    const ingredients = await Ingredient.find(query)
      .sort(sortOptions)
      const ingredientsWithBase64Image = ingredients.map(ingredient => {
        const uint8Array = new Uint8Array(ingredient.productImage.data);
        const base64ImageData = Buffer.from(uint8Array).toString('base64');
        return {
          ...ingredient.toObject(),
          productImage: { data: base64ImageData, contentType: ingredient.productImage.contentType }
        };
      });
    return res.json(ingredientsWithBase64Image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Get an ingredient
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Get the vendor ID from the authenticated vendor
    const vendorId = req.user.id;

    // Find the ingredient by ID and vendor
    const foundIngredient = await Ingredient.findOne({ _id: id, vendor: vendorId });
   
    if (!foundIngredient) {
      return res.status(404).json({ message: 'Ingredient not found or unauthorized' });
    }
    const unit8Array = new Uint8Array(foundIngredient.productImage.data);
    const base64string = Buffer.from(unit8Array).toString('base64');
    
    const ingredientDataWithBase64Image = { ...foundIngredient._doc, productImage: base64string };
 
    return res.json(ingredientDataWithBase64Image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new ingredient
router.post('/new', authenticateToken, upload.single('productImage'), async (req, res) => {
  try {
    console.log("im here",req.body)
console.log("im inher",req.file);
const productImage = req.file ? req.file.buffer : null;

// Check if productImage is still undefined or null
if (productImage === undefined || productImage === null) {
  return res.status(400).json({ message: 'Product image is required.' });
}
const bufferData = Buffer.from(productImage.buffer);
    const { name, price, type, description, quantity,unit,limit,stock } = req.body;


    // Validate required fields
    if (!name || !price || !type || !quantity || !limit || !stock )  {
      return res.status(400).json({ message: 'Name, price, type, and quantity are required fields.' });
    }

    // Use the authenticated vendor from the middleware
    const vendorId = req.user.id;

    // Create a new ingredient associated with the authenticated vendor
    const newIngredient = new Ingredient({
      name,
      description: description || '',
      price,
      type,
      quantity,
      unit,
      limit,
      stock,
      vendor: vendorId,
      productImage: {
        data: bufferData,
        contentType: productImage.mimetype,
    
        },
    });

    // Save the new ingredient
    await newIngredient.save();

    return res.status(201).json(newIngredient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:id', authenticateToken, upload.single('productImage'), async (req, res) => {
  const { id } = req.params;

  try {
    // Find the ingredient by ID and vendor
    const ingredient = await Ingredient.findById(id);

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found or unauthorized' });
    }

    const ingredientData = JSON.parse(req.body.ingredientData); // Parse JSON data

    ingredient.name = ingredientData.name || ingredient.name;
    ingredient.price = ingredientData.price || ingredient.price;
    ingredient.type = ingredientData.type || ingredient.type;
    ingredient.description = ingredientData.description || ingredient.description;
    ingredient.quantity = ingredientData.quantity || ingredient.quantity;
    ingredient.unit = ingredientData.unit || ingredient.unit;
    ingredient.limit = ingredientData.limit || ingredient.limit;
    ingredient.stock = ingredientData.stock || ingredient.stock;

    if (req.file) {
      ingredient.productImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await ingredient.save(); // Save the updated ingredient

    return res.json({ message: 'Ingredient updated successfully', ingredient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete an ingredient
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the authenticated vendor from the middleware
    const vendorId = req.user.id;

    // Find and remove the ingredient by ID and vendor
    const deletedIngredient = await Ingredient.findOneAndDelete({ _id: id, vendor: vendorId });

    if (!deletedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found or unauthorized' });
    }

    return res.json({ message: 'Ingredient deleted successfully', deletedIngredient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;



  