// Discover.js
import NutNav from '../components/N-Nav';
import './makeplan.css'; // Updated CSS file name
import React, { useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore.js';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Discover = () => {
    
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const token = useTokenStore((state) => state.token);
  const { userId, bmi } = useParams();

  const fetchRecipes = async () => {
    console.log("nicee");
    try {
      const response = await fetch(`http://localhost:9000/n/recipes?page=$1&pageSize=$3`, {});
      console.log("nicee1");

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      console.log(data, "Whatt");
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddToMealPlan = (recipeId) => {
    setSelectedRecipes((prevSelectedRecipes) => [...prevSelectedRecipes, recipeId]);
  };

  const handleCreateMealPlan = async () => {
    try {
      const response = await fetch(`http://localhost:9000/n/create-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userId,
          recipes: selectedRecipes,
          bmi: bmi,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipes to meal plan');
      }

      const data = await response.json();
      console.log("food", data); // Handle the response as needed
      // Clear the selected recipes after creating the meal plan
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Error adding recipes to meal plan:', error.message);
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
              <div className="recipe-name14">
                {recipe.title}
                <span className="plus-icon14" onClick={() => handleAddToMealPlan(recipe._id)}>
                  +
                </span>
              </div>
              {/* Include other recipe details here */}
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
        {selectedRecipes.length > 0 && (
          <div>
            <button onClick={handleCreateMealPlan}>Create Meal Plan</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Discover;
