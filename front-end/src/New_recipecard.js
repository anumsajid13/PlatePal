// RecipeCard.jsx
import { useState, useRef,useEffect } from 'react';
import './landingpage.css';


const RecipeCard = ({ recipe }) => {

 
  
  
  const imageData = new Uint8Array(recipe.recipeImage.data).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ''
  );

   

  console.log('Recipe Image Data:', imageData);

 
  const handleCardClick = async () => {
    
     
  };


  function truncateText(text, limit) {
    if (text) {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }
  return '';
  }

 
  return (
    <div className="outer-recipe">
        <div className="recipe-card-landingpage">
            <div className='relative-container-landingpage'>     
                <img   className="food-image-landingpage " src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  / >               
            </div>
          <div className="flexxx-landingpage">
            <h3 >
                {recipe.title} by Chef {recipe.chef ? recipe.chef.name : 'Unknown Chef'}
            </h3>
            <p className='desc-para'>{truncateText(recipe.description, 20 )}</p>
          </div>
        </div>
    </div>
    
  );
};

export default RecipeCard;
