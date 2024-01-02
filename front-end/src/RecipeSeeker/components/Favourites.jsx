import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipieCard';
import Navbar from './Navbar'
import { BASE_URL } from '../../url';

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/recepieSeeker/favourite-recipes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          const favoriteRecipesData = responseData.favouriteRecipes || [];
          setFavoriteRecipes(favoriteRecipesData);
        } else {
          console.error('Failed to fetch favorite recipes:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching favorite recipes:', error.message);
      }
    };

    fetchFavoriteRecipes();
  }, []); 

  return (
    <div>
      
      <Navbar activeLink="Favourites" />
      <h2 className='favorites-heading'>Your Favorite Recipes</h2>

      <div  style={{ marginTop:"5%" , backgroundColor:"#ffe853", width:"96%"}} className="recipe-list">
        {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
    </div>
    </div>
  );
};

export default Favorites;
