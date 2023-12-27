// AdminNav.js
import React, { useState,useEffect } from 'react';
import './adminNav.css'; // Import the CSS file
import NotificationPopup from './NotificationPopup';
import './sidebar.css';
import { Link } from 'react-router-dom';
import useNotificationStore from './NotificationStore'; // Import the Zustand store
import useTokenStore from '../../tokenStore';

const AdminNav = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

        <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>
          <div>Home</div>
          </Link>
          <div className="icon-link" title="notifications" onClick={handleNotificationsClick}>
            <span className="material-icons google-icon">notifications</span>
          </div>

          <Link to="/admin/edit-profile" style={{ textDecoration: 'none', color: 'black'}}>

          <div className="icon-link" title="Profile">
            <span className="material-icons google-icon">person</span>
          </div>
          </Link>
          <div className="icon-link" title="Menu" onClick={handleSidebarToggle}>
          <span className="material-icons">menu</span>
        </div>

        </div>
        {showNotifications && <NotificationPopup onClose={handleCloseNotifications} />}
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleSidebarToggle} className="close-btn">×</a>
       
        <Link to="/admin/MainBlock" onClick={handleSidebarToggle}>
        <a href="#">View Blocked Reports</a>
        </Link>

        <Link to="/admin/blocked-users" onClick={handleSidebarToggle}>
        <a href="#">Blocked users</a>
        </Link>

        <Link to="/admin/registered-users" onClick={handleSidebarToggle}>
        <a href="#">Registered Users</a>
        </Link>

        <Link to="/admin/check-c" onClick={handleSidebarToggle}>
        <a href="#">View Certifications</a>
        </Link>

        <Link to="/admin/delete" onClick={handleSidebarToggle}>
        <a href="#">Delete Users</a>
        </Link>


      </div>
    </div>
  );
};

export default AdminNav;
