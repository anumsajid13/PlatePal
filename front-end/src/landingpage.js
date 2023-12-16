//landngpage.js
import React from 'react';
import './landingpage.css'; 
import  { useState } from 'react';
import { Link } from 'react-router-dom';
import useNavbarStore from './navbarStore'; 

// Create the functional component for the landing page
const LandingPage = () => {

  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
 
  return (
    <div>
      {/* White navigation bar */}
      <nav className="navbar">
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
            color: activeLink === 'Home' ? 'red' : 'black', 
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
        <div className="image">
          <img
            src="https://i.pinimg.com/originals/de/f8/c3/def8c32218ff550de986ca3dfe09cac8.gif"
            alt="Best Food"
            className="best-food-image"
          />
        </div>
      </div>

    <div className="outer-container">
      {/* Clickable text divs row */}
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
      <div className="food-info-container">
        {/* Food info div 1 */}
        <div className="food-info">
          <img src="https://img.hellofresh.com/w_1920,q_auto,f_auto,c_limit,fl_lossy/c_fill,f_auto,fl_lossy,h_432,q_auto/hellofresh_s3/image/654a60e0cfbffe92530de215-7053eecf.jpeg" alt="Food 1" />
          <p>Cheesy Smoked Burgers</p>
          <p>$9.99</p>
        </div>

        {/* Food info div 2 */}
        <div className="food-info">
          <img src="https://img.hellofresh.com/w_1920,q_auto,f_auto,c_limit,fl_lossy/c_fill,f_auto,fl_lossy,h_432,q_auto/hellofresh_s3/image/645122e8c0c78ab72707df23-0084c382.jpg" alt="Food 2" />
          <p>Pork Noodle Stir Fry</p>
          <p>$12.99</p>
        </div>

        {/* Food info div 3 */}
        <div className="food-info">
          <img src="https://img.hellofresh.com/w_1920,q_auto,f_auto,c_limit,fl_lossy/c_fill,f_auto,fl_lossy,h_432,q_auto/hellofresh_s3/image/654a63cacfbffe92530de278-e7ed2431.jpeg" alt="Food 3" />
          <p>Lemony Shrimp Bowl</p>
          <p>$14.99</p>
        </div>
      </div>

      </div>
    </div>
  );
}

// Export the component for use in other files
export default LandingPage;