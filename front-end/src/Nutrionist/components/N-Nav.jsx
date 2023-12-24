// AdminNav.js
import React, { useState,useEffect } from 'react';
import '../../Admin/components/AdminNav'; // Import the CSS file
import NotificationPopup from './Npopup';
import '../../Admin/components/sidebar.css';
import { Link } from 'react-router-dom';
import useNotificationStore from './Nstore'; // Import the Zustand store
import useTokenStore from '../../tokenStore';

const AdminNav = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(''); 

  const token = useTokenStore((state) => state.token);

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleNotificationsClick = () => {
    setShowNotifications(true);
  };

 

  return (
    <div>
      <nav className="admin-navbar">
        {/* Plate Pal logo on the left */}
        <div className="logo">Plate Pal</div>

        

        {/* Clickable components on the right */}
        <div className="nav-links">
          <div>Home</div>
          <div>Reviews</div>
          <div className="icon-link" title="notifications" onClick={handleNotificationsClick}>
            <span className="material-icons google-icon">notifications</span>
          </div>
          <div className="icon-link" title="Profile">
            <span className="material-icons google-icon">person</span>
          </div>
          <div className="icon-link" title="Menu" onClick={handleSidebarToggle}>
          <span className="material-icons">menu</span>
        </div>
        </div>
        {showNotifications && <NotificationPopup onClose={handleCloseNotifications} />}
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleSidebarToggle} className="close-btn">×</a>
       
        <Link to="/n/makePlan" onClick={handleSidebarToggle}>
          Make Plan
        </Link>
        <Link to="/n/PlanMade" onClick={handleSidebarToggle}>
        <a href="#">View Plan</a>
        </Link>

      </div>
    </div>
  );
};

export default AdminNav;