import  {React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import '../components/RecipePopUpChef.css';


const RecipePopUpChef = ({ selectedRecipe, setSelectedRecipe }) => {
    
    if (!selectedRecipe) return null;

    console.log(selectedRecipe);
    return(

     <>
           
           <div className="chef-recipe-popup-container">
  <div className="chef-recipe-popup">
    <div className="chef-recipe-image-container">
      <img src={`data:image/jpeg;base64,${selectedRecipe.recipeImage.data}`} className="chef-recipe-image" alt="Recipe" />
      <div className="chef-recipe-details">
        <h2 className="chef-recipe-title">{selectedRecipe.title}</h2>
        <p className="chef-recipe-chef">By Chef {selectedRecipe.chefName}</p>
      </div>
      <button className="chef-pop-close-btn" onClick={() => setSelectedRecipe(null)}>
        <span className="material-icons">close</span>
      </button>

         
    </div>
            <div className='chef-popup-three-content'>
                    <div className='chef-popup-content-item'>
                        <p>Total Time: {selectedRecipe.totalTime}</p>
                    </div>
                    <div className='chef-popup-content-item'>
                        <p>Calories: {selectedRecipe.calories}</p>
                    </div>
                    <div className='chef-popup-content-item'>
                        <p>Difficulty: {selectedRecipe.difficulty}</p>
                    </div>
                </div>
            <div className="top-chef-recipe-description">
                <h2>Description:</h2>
                <p className='chef-recipe-description'>{selectedRecipe.description}</p>  
            </div>

            <div className="top-chef-recipe-description">
                <h2>Allergens:</h2>
                <ul className='chef-recipe-description'>
                    {selectedRecipe.allergens.map((allergen, index) => (
                    <li key={index}>{allergen.replace(/"/g, '')}</li>
                    ))}
                </ul>
            </div>

            <div className="chef-recipe-ingredients">
            <h2>Ingredients:</h2>
            <div className="ingredient-columns">
                <ul className="ingredient-column">
                {selectedRecipe.ingredients.slice(0, Math.ceil(selectedRecipe.ingredients.length / 2)).map((ingredient, index) => (
                    <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                ))}
                </ul>
                <ul className="ingredient-column">
                {selectedRecipe.ingredients.slice(Math.ceil(selectedRecipe.ingredients.length / 2)).map((ingredient, index) => (
                    <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                ))}
                </ul>
            </div>
            </div>

            <div className="chef-recipe-not-delivered">
            <h2>Not included in your delivery:</h2>
            <ul>
                {selectedRecipe.notDelivered.map((item, index) => (
                <li key={index}>{item.replace(/"/g, '')}</li>
                ))}
            </ul>
            </div>

            <div className="chef-recipe-utensils">
            <h2>Utensils:</h2>
            <ul>
                {selectedRecipe.utensils.map((utensil, index) => (
                <li key={index}>{utensil.replace(/"/g, '')}</li>
                ))}
            </ul>
            </div>

            {/* need to nutritional table , instructions, comments, ratingss*/}

  </div>
</div>
    </>
    );


};



export default RecipePopUpChef;