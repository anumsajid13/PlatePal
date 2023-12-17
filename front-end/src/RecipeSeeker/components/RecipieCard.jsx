// RecipeCard.js
import RecipeRating from './RecipeRating.jsx'
import  { React,useState } from 'react';
import './RecipeCard.css'

const RecipeCard = ({ recipe }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  
    const handleCardClick = () => {
        console.log("popup open")
      setIsPopupOpen(true);
    };
  
    const handleClosePopup = () => {
      setIsPopupOpen(false);
    };
  
    return (
      <>
        <div className="recipe-card" >
          <>
          <img src='/pasta.jpg' alt="image here" style={{width: "300px" ,height:"180px"}}></img>
          </>
          <div className='flexxx'>
          <h3 onClick={handleCardClick}>{recipe.title} by Chef {recipe.chef.name}</h3>   
          <p>{recipe.description}</p>     
          </div>
        </div>
  
        {/* Popup for detailed recipe view */}
        <div className={`recipe-popup ${isPopupOpen ? 'popup-open' : ''}`}>
        <span className="close-btn" onClick={handleClosePopup}>
            &times;
        </span>
        <div className="recipe-details">
            <div className="recipe-details-left">
            <img src="/pasta.jpg" alt="image here" />
            <p>Ingredients:</p>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                    {ingredient.name}: {ingredient.quantity}
                </li>
                ))}
            </ul>
            <p>Allergens:</p>
            <ul>
                {recipe.allergens.map((all, index) => (
                <li key={index}>
                    {all}
                </li>
                ))}
            </ul>
            <p>Required Utensils:</p>
            <ul>
                {recipe.utensils.map((uten, index) => (
                <li key={index}>
                    {uten}
                </li>
                ))}
            </ul>

            <p>Instructions:</p>
            <ul>
                {recipe.instructions.map((instruct, index) => (
                <li key={index}>
                    {instruct}
                </li>
                ))}
            </ul>
            
            </div>
            <div className="recipe-details-right">
            <h3 >{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p className='recepie-category'>Chef: {recipe.chef.name}</p>
            <p className='recepie-category'>Serving size: {recipe.servingSize}</p>
            <p className='recepie-category'>Calories: {recipe.calories}</p>
            <p className='recepie-category'>Total Time: {recipe.totalTime}</p>
            <ul className='recepie-category'>
                {recipe.category.map((cat, index) => (
                <li key={index}>{cat}</li>
                ))}
            </ul>
            <div className="Rating-class">
            <p>Ratings: {recipe.ratings.length}</p>
            <p>Ratings by: {recipe.ratings.user}</p>
            <RecipeRating
                recipeId={recipe._id}
                initialRating={0}
                onSaveRating={(recipeId, selectedRating) => {
                // Implement logic to save the rating to the backend
                console.log(`Recipe ${recipeId} rated with ${selectedRating} stars`);
                }}
            />
            </div>
            </div>
        </div>
        </div>
        
      </>
    );
  };
  
  export default RecipeCard;

