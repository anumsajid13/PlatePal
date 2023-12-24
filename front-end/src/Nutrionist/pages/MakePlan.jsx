// Discover.js
import NutNav from '../components/N-Nav';
import './makeplan.css'; // Updated CSS file name
import { React, useEffect, useState,useParams } from 'react';
import useTokenStore from '../../tokenStore.js';
import { jwtDecode } from 'jwt-decode';

const Discover = () => {
  const [recipes, setRecipes] = useState([]);
  const [followingChefIds, setFollowingChefIds] = useState([]);
  const token = useTokenStore((state) => state.token);
  const { userId, bmi } = useParams();
  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:9000/n/recipes?page=$1&pageSize=$3', {});

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddToMealPlan = async (recipeId) => {
    try {
      const response = await fetch('http://localhost:9000/n/create-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          recipes: [recipeId],
          bmi: bmi,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipe to meal plan');
      }

      const data = await response.json();
      console.log(data); // Handle the response as needed
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error.message);
    }
  };

  return (
    <>
      <NutNav />
      <div className='main-container14'>
        <div className="search-container14">
          <div className="search-card14">
            <input className='search-recipe14' type="text" placeholder="Search..." />
            <select className="search-dropdown14">
              <option value="recipeName">Search by Recipe Name</option>
              <option value="chef">Search by Chef</option>
            </select>
            <span className="material-icons search-icon14">search</span>
          </div>
        </div>
        <div className="recipe-list14">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-item14">
              <div className="recipe-name14">{recipe.title}
              <span className="plus-icon14" onClick={() => handleAddToMealPlan(recipe._id)}>
                    +
             </span>
              </div>
              <div className="recipe-description14">{recipe.description}</div>
              <div className="recipe-ingredients14">
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{`${ingredient.name}: ${ingredient.quantity}`}</li>
                  ))}
                </ul>
              </div>
              <div className="recipe-allergens14">
                <ul>
                  {recipe.allergens.map((allergen, index) => (
                    <li key={index}>{allergen}</li>
                  ))}
                </ul>
              </div>
              <div className="recipe-calories14">{`Calories: ${recipe.calories}`}</div>
              <div className="recipe-image14">
                <img src={`data:${recipe.recipeImage.contentType};base64,${recipe.recipeImage.data}`} alt="Recipe" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Discover;
