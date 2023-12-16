// AdminNav.js
import React from 'react';
import './adminNav.css'; // Import the CSS file

const AdminNav = () => {
  return (
    <nav className="admin-navbar">
      {/* Plate Pal logo on the left */}
      <div className="logo">Plate Pal</div>

      {/* Search bar with search icon */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button className="search-button">
          <span className="material-icons google-icon">search</span>
        </button>
      </div>

      {/* Clickable components on the right */}
      <div className="nav-links">
        <div>Home</div>
        <div>Recipes</div>
        <div>Plan</div>
        <div>Reviews</div>
        <div>Nutritionist</div>
        <div className="icon-link" title="Profile">
          <span className="material-icons google-icon">person</span>
        </div>
        <div className="icon-link" title="Cart">
          <span className="material-icons google-icon">notifications</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
