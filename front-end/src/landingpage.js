//landngpage.js
import './landingpage.css';

import { Link } from 'react-router-dom';
import useNavbarStore from './navbarStore'; 
import RecipeCard from './New_recipecard';
import  {React, useEffect, useState } from 'react';

// Create the functional component for the landing page
const LandingPage = () => {

  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:9000/recepieSeeker/allRecipes?page=$1&pageSize=$3');
 
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
    console.log("fetching...")
    fetchRecipes();
    
  }, []);
 
  return (
    <div className='The-most-outer-part'>
      {/* White navigation bar */}
      <nav className="navbar-landingpage">
        {/* Plate Pal logo on the left */}
        <div className="logo">Plate Pal</div>

        {/* Search bar with search icon */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-button">
            <span className="material-icons google-icon">search</span>
          </button>
        </div>

        {/* Clickable components on the right */}
        <div className="nav-links">
          <div onClick={() => setActiveLink('/')} className={activeLink === 'Home' ? 'active-link' : ''} 
          style={{
            color: activeLink === 'Home' ? 'white' : 'black', 
            textDecoration: 'none', 
            cursor: 'pointer', 
          }}
          >Home</div>
          <div onClick={() => setActiveLink('Contact Us')} className={activeLink === 'Contact Us' ? 'active-link' : ''}
           style={{
            color: activeLink === 'Contact Us' ? 'red' : 'black', 
            textDecoration: 'none', 
            cursor: 'pointer', 
          }}
          >Contact Us</div>
          <div onClick={() => setActiveLink('About Us')} className={activeLink === 'About Us' ? 'active-link' : ''}
           style={{
            color: activeLink === 'About US' ? 'red' : 'black', 
            textDecoration: 'none', 
            cursor: 'pointer', 
          }}
          >About Us</div>
          <div className="icon-link dropdown" title="Profile" onClick={toggleDropdown}>
            <span className="material-icons google-icon">person</span>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/signup" className='link'>Sign Up</Link>
                <Link to="/signin" className='link'>Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Yellow background div with "Best Food" text and image */}
      <div className="best-food-container">
        <div className="best-food-text">
          <span className="inline-text">The best </span>
          <span className="inline-text">delicious food</span>

          <div className="additional-text">
            <p>Explore our delicious and nutritious food options made with the freshest ingredients.</p>
          </div>
          <button className="discover-menu-button">Discover Menu</button>
        </div>

        {/* You can replace the placeholder with the actual image source */}
        <div className="image-landingpage">
         
        </div>
      </div>

    <div className="outer-container-landingpage">
      <div className="category-container">
        <div className="category" >
          Salads
        </div>
        <div className="category" >
          Burgers
        </div>
        <div className="category" >
          Pasta
        </div>
        <div className="category" >
          Pizza
        </div>
      </div>

      {/* Food information divs */}
      <div className="LALALALA">
      <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe._id}>
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
               
              />
            </div>
          ))}
        </div>
        
      </div>

      </div>
    </div>
  );
}

// Export the component for use in other files
export default LandingPage;