// Discover.js
import RecipeCard from './RecipieCard';
import Navbar from './Navbar'; 
import './Discover.css';
import  {React, useEffect, useState } from 'react';

const Discover = () => {

    const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:9000/allRecipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error('Error fetching recipes:', error.message);
      }
    };

    fetchRecipes();
  }, []);
  return (
    <>
      <Navbar activeLink="Discover" />

      <div className='home'>
      <div className="discover-container-1">
        <div className="search-card-1">
          <input className='searchRecepie' type="text" placeholder="Search..." />
          <select className="search-dropdown-1">
            <option value="recipeName">Search by Recipe Name</option>
            <option value="chef">Search by Chef</option>
          </select>
          <span className="search-icon-1">&#128269;</span>
          
        </div>
        <div className="category-card-1">
          <label>Category 1</label>
          <label>Category 2</label>
          <label>Category 3</label>
          <label>Category 4</label>
          <label>Category 5</label>
        </div>
      </div>
      <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Discover;
