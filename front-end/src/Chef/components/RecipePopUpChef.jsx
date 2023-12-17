import  {React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import '../components/RecipePopUpChef.css';


const RecipePopUpChef = ({ selectedRecipe, setSelectedRecipe }) => {
    if (!selectedRecipe) return null;

    return(

     <>

        <div className="recipe-popup-container">
            <div className="recipe-popup">
                        <button className="close-btn" onClick={() => setSelectedRecipe(null)}>Close</button>
                        <h2 className="recipe-title">{selectedRecipe.title}</h2>
                        <p className="recipe-chef">By Chef: {selectedRecipe.chefName}</p>
                        <img src={`data:image/jpeg;base64,${selectedRecipe.recipeImage.data}`} className="recipe-image" alt="Recipe" />
                        <p className="recipe-description">{selectedRecipe.description}</p>
                        {/* Add more details as needed */}
             </div>
        </div>

    </>
    );


};



export default RecipePopUpChef;