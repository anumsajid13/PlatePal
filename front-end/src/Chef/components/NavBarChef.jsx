//chef nav bar
import React, { useState } from 'react';
import './navbarChef.css'; 
import './chefsidebar.css';
import { Link, useNavigate  } from 'react-router-dom'; 
import ChefNotificationBox from '../components/ChefNotificationss';
import useTokenStore from '../../tokenStore';

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

  const handleLogoutClick = () => {
    setIsLoading(true);

    //useTokenStore.getState().logout();
    localStorage.removeItem('token');
    
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
    <nav className="chef-chef-navbar">
     
    
        <div className="chef-chef-navbar-logo">Plate Pal</div>
 
      {/* Clickable components on the right */}
      <div className="chef-nav-links">
        <div><Link className='chef-linkss' to="/Chef/Mainpage">Home</Link></div>
        <div><Link className='chef-linkss' to="/Chef/CreateRecipe">Create Recipe</Link></div>
        <div className="chef-icon-link" title="Profile">
          <Link className='chef-linkss' to="/Chef/myProfile">
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

      <div className={`chef-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleSidebarToggle} className="chef-close-btn"><span className="material-icons">close</span></a>
        <Link className='chef-linkss' to="/Chef/AllCollabs">Collab Requests</Link>
        <Link className='chef-linkss' to="/Chef/AllReviews">My Reviews</Link>
        <Link className='chef-linkss' to="/Chef/allVendors/1">Vendors</Link>
        <Link className='chef-linkss' to="/Chef/myFollowers">Followers</Link>
        <Link className='chef-linkss' to="/Chef/BlockReports">Block Reports</Link>
        <Link className='chef-linkss' to="/Chef/usersInbox">Recipe Seekers Inbox</Link>
        <Link className='chef-linkss' to="/Chef/vendorsInbox">Vendors Inbox</Link>
      </div>

      {showNotifications && <ChefNotificationBox />}
      </div>

  );
};

export default ChefNav;
