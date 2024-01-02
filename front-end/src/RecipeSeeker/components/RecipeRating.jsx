// RecipeRating.jsx
import React, { useState } from 'react';

const RecipeRating = ({ recipeId, initialRating, onSaveRating }) => {
  const [rating, setRating] = useState(initialRating);
  const maxRating = 5;

  const handleStarClick = (selectedRating) => {
 
    const newRating = rating === selectedRating ? rating - 1 : selectedRating;
    setRating(newRating);

   
    onSaveRating(recipeId, newRating);
  };

  return (
    <div className="recipe-rating">
      {[...Array(maxRating)].map((_, index) => (
        <img style={{width:"20px" }}
          key={index}
          src={index < rating ? '/filled-star-image.svg' : '/unfilled-star-image.svg'}
          alt={`Star ${index + 1}`}
          onClick={() => handleStarClick(index + 1)}
        />
      ))}
    </div>
  );
};

export default RecipeRating;
