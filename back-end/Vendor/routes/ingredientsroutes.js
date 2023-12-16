const express = require('express');
const Ingredient = require('../../models/Ingredient Schema');
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const router = express.Router();
 

// Add a new ingredient
router.post('/new',authenticateToken, async (req, res) => {
  try {
    const { name, price, description, type, quantity, constituentsOf } = req.body;

    // Validate required fields
    if (!name || !price || !type) {
      return res.status(400).json({ message: 'Name, price,type and quantity are required fields.' });
    }

    // Create a new ingredient
    const newIngredient = new Ingredient({
      name,
      price,
      description: description || '', // Set default value if not provided
      type,
      constituentsOf: constituentsOf || null, 
    });

    // Save the new ingredient
    await newIngredient.save();

    return res.status(201).json(newIngredient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

  //update an ingredient
router.put('/ingredients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    //find by id and then update the information
    const ingredient = await Ingredient.findByIdAndUpdate(id,{ $set: req.body }, { new: true } );//set ensures that only those fields that are updated are changed
//if only use req.body then all the fields are updated even if they are not changed or are not provided
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    return res.json(ingredient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/ingredients/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the authenticated vendor from the middleware
    const vendorId = req.authenticatedVendor._id;

    // Find and remove the ingredient by ID and vendor
    const deletedIngredient = await Ingredient.findOneAndRemove({ _id: id, vendor: vendorId });

    if (!deletedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found or unauthorized' });
    }

    return res.json({ message: 'Ingredient deleted successfully', deletedIngredient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ... (other routes remain unchanged)


//get an ingredient
router.get('/ingredients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the ingredient by ID
    const foundIngredient = await Ingredient.findById(id);

    if (!foundIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    return res.json(foundIngredient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


//get all ingredients with filtering ,sorting and pagination
router.get('/ingredients', async (req, res) => {
  try {
    // Extract query parameters
    const { sortBy, sortOrder, filterType, filterValue, page=1, pageSize=30 } = req.query;

    // Build the query object
    const query = {};
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

    const sortOptions = {};
    if(!sortBy)
    {
    sortOptions[sortBy]=1;
    }
    if (sortBy && sortBy=='price') {
      let sortvalue;
      if (!sortOrder) {
        sortvalue = 1;//asc default
      } else if (sortOrder === 'highest') {
        sortvalue = -1;//desc
      } else {
        sortvalue = 1;//sortorder=='lowest' 
      }
      sortOptions[sortBy] = sortvalue; 
    } 
  
    const skip = (page - 1) * pageSize;

    // Fetch ingredients based on the query, sort, and pagination
    const ingredients = await Ingredient.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(pageSize));

    return res.json(ingredients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

  