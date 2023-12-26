//chef nav bar
import React, { useState } from 'react';
import '../assets/styles/navBar.css';
import Sidebar from './vendor_sidebar';
import { Link, useNavigate  } from 'react-router-dom'; 
//import ChefNotificationBox from '../components/ChefNotificationss';

const ChefNav = () => {
  
  const navigate= useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    
    setShowNotifications(!showNotifications);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  const handleLogoutClick = () => {
    setIsLoading(true);

    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/signin');
    }, 1000); 



    
  };

  return (
    <div>
        {isLoading && (
        <div className="chef-overlay">
        <div className="chef-spinner"></div>
          <span className="loading-text">Logging out...</span>
        </div>
      )}
    <nav className="chef-navbar">
     
    
        <div className="chef-navbar-logo">Plate Pal</div>

      <div className="chef-search-bar">
        <input className="chef-search-bar-input" type="text" placeholder="Search" />
        <button className="chef-search-button">
          <span className="material-icons google-icon">search</span>
        </button>
      </div>


      <div className="chef-nav-links">
        <div><Link className='chef-linkss' to="/Vendor/MainPage">Home</Link></div>
        <div className="chef-icon-link" title="Profile">
          <Link className='chef-linkss' to="/Vendor/Profile">
          <span className="material-icons google-icon">person</span>
          </Link>
          <span className="material-icons google-icon" onClick={handleNotificationClick}>
            notifications
            {showNotifications && <span className="arrow-up"></span>}
          </span>
          
                {isLoading ? (
                <span>Logging out...</span>
            ) : (
                <span className="material-icons google-icon" onClick={handleLogoutClick}>logout</span>
            )}
         
        </div>

        <div className="chef-icon-link" title="Toggle Sidebar" onClick={handleSidebarToggle}>
          <span className="material-icons">menu</span>
        </div>
       
        
    
      </div>

    </nav>

    <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* {showNotifications && <ChefNotificationBox />} */}
      </div>

  );
};

export default ChefNav;
