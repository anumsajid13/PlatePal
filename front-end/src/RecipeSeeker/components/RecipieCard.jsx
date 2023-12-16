// RecipeCard.js
import React from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      <p>Chef: {recipe.chef.name}</p>
      <p>Ratings: {recipe.ratings.length}</p>
      {/* Add more information as needed */}
    </div>
  );
};

export default RecipeCard;
