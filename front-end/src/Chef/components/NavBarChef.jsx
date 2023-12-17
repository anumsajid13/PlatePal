//chef nav bar
import React, { useState } from 'react';
import './navbarChef.css'; 
import './chefsidebar.css';
import { Link } from 'react-router-dom'; 

const ChefNav = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
    <nav className="chef-navbar">
     
      <div className="chef-icon-link" title="Toggle Sidebar" onClick={handleSidebarToggle}>
          <span className="material-icons">menu</span>
        </div>

      {/* Search bar with search icon */}
      <div className="chef-search-bar">
        <input type="text" placeholder="Search" />
        <button className="chef-search-button">
          <span className="material-icons google-icon">search</span>
        </button>
      </div>

      {/* Clickable components on the right */}
      <div className="chef-nav-links">
        <div>Home</div>
        <div>Create Recipe</div>
        <div className="chef-icon-link" title="Profile">
          <span className="material-icons google-icon">person</span>
        </div>
       
        <span className="material-icons google-icon">notifications</span>
    
      </div>

    </nav>

      <div className={`chef-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleSidebarToggle} className="chef-close-btn"><span className="material-icons">close</span></a>
        <a href="#">My Recipes</a>
        <a href="#">Collab Requests</a>
        <a href="#">My Vendors</a>
        {/*<Link to="/admin/blockreport" onClick={handleSidebarToggle}>View Block Reports</Link> */}
        
      </div>
      </div>

  );
};

export default ChefNav;
