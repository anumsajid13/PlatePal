const express = require('express');
const router = express.Router();
const Vendor = require('../../models/Vendor Schema');
const Ingredient = require('../../models/Ingredient Schema');

//get all the vendors
router.get('/vendors', async (req, res) => {
    try {
      const unblockedVendors = await Vendor.find({ isBlocked: false });
      res.status(200).json(unblockedVendors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

//get the ingredients for every vendor
router.get('/vendors-with-ingredients', async (req, res) => {
  try {
    const vendors = await Vendor.find({}, ' _id name email profilePicture');

    const vendorsWithIngredients = [];

    for (const vendor of vendors) {
      const vendorData = {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        ingredients: [], 
      };

      //handlig vendors profile picture
      if (vendor.profilePicture && vendor.profilePicture.data && vendor.profilePicture.contentType) {
        try {
          const base64ImageData = vendor.profilePicture.data.toString('base64');
          vendorData.profilePicture = {
            data: base64ImageData,
            contentType: vendor.profilePicture.contentType,
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
          vendorData.profilePicture = {
            data: '',
            contentType: vendor.profilePicture.contentType,
          };
        }
      } else {
        vendorData.profilePicture = {
          data: '',
          contentType: '',
        };
      }

      const ingredients = await Ingredient.find({ vendor: vendor._id });
      for (const ingredient of ingredients) {
        const ingredientData = {
          name: ingredient.name,
          description: ingredient.description,
          price: ingredient.price,
          quantity: ingredient.quantity,
        };

        //handling ingredient images
        if (ingredient.productImage && ingredient.productImage.data && ingredient.productImage.contentType) {
          try {
            const base64ImageData = ingredient.productImage.data.toString('base64');
            ingredientData.productImage = {
              data: base64ImageData,
              contentType: ingredient.productImage.contentType,
            };
          } catch (error) {
            console.error("Error converting ingredient image to base64:", error);
            ingredientData.productImage = {
              data: '',
              contentType: ingredient.productImage.contentType,
            };
          }
        } else {
          ingredientData.productImage = {
            data: '',
            contentType: '',
          };
        }

        vendorData.ingredients.push(ingredientData);
      }

      vendorsWithIngredients.push(vendorData);
    }

    res.status(200).json(vendorsWithIngredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;