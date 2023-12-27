// Discover.js
import NutNav from '../components/N-Nav';
import React, { useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore.js';
import { useParams } from 'react-router-dom';
import './makeplan.css'; // Updated CSS file name

const Discover = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = useTokenStore((state) => state.token);
  const { userId, bmi } = useParams();
  const [notification, setNotification] = useState('');
  const [recipeStates, setRecipeStates] = useState({});

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`http://localhost:9000/n/recipes?page=$1&pageSize=$3&q=${searchQuery}`, {});

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
  }, [searchQuery]);

  const handleAddToMealPlan = (recipeId) => {
    setSelectedRecipes((prevSelectedRecipes) => [...prevSelectedRecipes, recipeId]);
    setNotification('Item added to plan!');
    setTimeout(() => {
      setNotification('');
    }, 3000); // Clear notification after 3 seconds
  };


  const handleRemoveFromMealPlan = (recipeId) => {
    setSelectedRecipes((prevSelectedRecipes) => prevSelectedRecipes.filter(id => id !== recipeId));
    setNotification('Item removed from plan!');
    setTimeout(() => {
      setNotification('');
    }, 3000); // Clear notification after 3 seconds
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
      setNotification('Meal plan created!');

      console.log("food", data);
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Error adding recipes to meal plan:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <NutNav />
      <div className='main-container14'>
        <div className="search-container14">
          <div className="search-card14">
            <input
              className='search-recipe14'
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <span className="material-icons search-icon14">search</span>
          </div>
        </div>
        <div className="recipe-list14">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-item14">
              <div className="recipe-name14">
                {recipe.title}
                <span className="material-icons search-icon14" onClick={() => handleAddToMealPlan(recipe._id)}>
                  add_circle
                </span>
                <span className="material-icons remove-icon" onClick={() => handleRemoveFromMealPlan(recipe._id)}>
                remove_circle
              </span>
              </div>
              <div className="recipe-image14">
                <img src={`data:${recipe.recipeImage.contentType};base64,${recipe.recipeImage.data}`} alt="Recipe" />
              </div>
              <div className="recipe-description14">
                {recipe.description}
                <span
                  className="show-more-link"
                  onClick={() =>
                    setRecipeStates((prev) => ({
                      ...prev,
                      [recipe._id]: !prev[recipe._id],
                    }))
                  }
                >
                  {recipeStates[recipe._id] ? "Show Less" : "Show More"}
                </span>
              </div>
              {recipeStates[recipe._id] && (
                <div>
                  <div className="recipe-ingredients14">
                    <h3>Ingredients:</h3>
                    <ul>
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{`${ingredient.name}: ${ingredient.quantity}`}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="recipe-allergens14">
                    <h3>Allergens:</h3>
                    <ul>
                      {recipe.allergens.map((allergen, index) => (
                        <li key={index}>{allergen}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="recipe-calories14">{`Calories: ${recipe.calories}`}</div>
                  <div className="chef-recipe-nutrients">
                    <h3>Nutrients:</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Nutrient</th>
                          <th>Value</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipe.Nutrients?.filter((nutrient) => nutrient.value !== 0).map((nutrient, index) => (
                          <tr key={index}>
                            <td>{nutrient.nutrientName}</td>
                            <td>{parseFloat(nutrient.value).toFixed(1)}</td>
                            <td>{nutrient.unitName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
