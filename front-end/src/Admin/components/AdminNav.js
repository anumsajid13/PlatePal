// AdminNav.js
import React, { useState } from 'react';
import './adminNav.css'; // Import the CSS file
import NotificationPopup from './NotificationPopup';
import './sidebar.css';
import { Link } from 'react-router-dom'; 

const AdminNav = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNotificationsClick = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
    <nav className="admin-navbar">
      {/* Plate Pal logo on the left */}

      <div className="icon-link" title="Toggle Sidebar" onClick={handleSidebarToggle}>
          <span className="material-icons">menu</span>
        </div>

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
        <div>Reviews</div>
        <div>Nutritionist</div>
        <div className="icon-link" title="Profile">
          <span className="material-icons google-icon">person</span>
        </div>
        <div className="icon-link" title="Cart" onClick={handleNotificationsClick}>
        <span className="material-icons google-icon">notifications</span>
      </div>
      </div>
      {showNotifications && <NotificationPopup onClose={handleCloseNotifications} />}

    </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleSidebarToggle} className="close-btn">×</a>
        <a href="#">View All users</a>
        <Link to="/admin/blockreport" onClick={handleSidebarToggle}>View Block Reports</Link> {/* Use Link for navigation */}
        <a href="#">Blocked users</a>
        <a href="#">Registered Users</a>
      </div>
      </div>

  );
};

export default AdminNav;
