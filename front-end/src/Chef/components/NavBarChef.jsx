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
     
    
        <div className="chef-navbar-logo">Plate Pal</div>
      {/* Search bar with search icon */}
      <div className="chef-search-bar">
        <input className="chef-search-bar-input" type="text" placeholder="Search" />
        <button className="chef-search-button">
          <span className="material-icons google-icon">search</span>
        </button>
      </div>

      {/* Clickable components on the right */}
      <div className="chef-nav-links">
        <div><Link className='chef-linkss' to="/Chef/Mainpage">Home</Link></div>
        <div><Link className='chef-linkss' to="/Chef/CreateRecipe">Create Recipe</Link></div>
        <div className="chef-icon-link" title="Profile">
          <span className="material-icons google-icon">person</span>
          <span className="material-icons google-icon">notifications</span>
          <span className="material-icons google-icon">logout</span>
        </div>

        <div className="chef-icon-link" title="Toggle Sidebar" onClick={handleSidebarToggle}>
          <span className="material-icons">menu</span>
        </div>
       
        
    
      </div>

    </nav>

      <div className={`chef-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleSidebarToggle} className="chef-close-btn"><span className="material-icons">close</span></a>
        <a href="#">Collab Requests</a>
        <Link className='chef-linkss' to="/Chef/allVendors">Vendors</Link>
        <a href="#">Followers</a>
        <a href="#">Block Reports</a>
        
      </div>
      </div>

  );
};

export default ChefNav;
