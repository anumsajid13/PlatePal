// Navbar.js
import { Link } from 'react-router-dom';
import { React, useState } from 'react';
import './Navbar-1.css';

const Navbar = ({ activeLink }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log("TOGGLE");
    console.log(activeLink);
  };

  return (
    <nav className="navbar-1">
      <div className="logo">Plate Pal</div>
      <div className="nav-links-1">
        <Link
          to="http://localhost:3000/recipe-seeker/Discover"
          className={activeLink === 'Discover' ? 'active-link-1' : ''}
        >
          Discover
        </Link>
        <Link to="/my-feed" className={activeLink === 'My Feed' ? 'active-link-1' : ''}>
          My Feed
        </Link>
       
        
          <span className="material-icons google-icon" style={{cursor:"pointer"}}>notifications</span>
          <span className="material-icons google-icon" style={{cursor:"pointer"}}>logout</span>
          <span class="material-icons google-icon icon-link-1"  onClick={toggleSidebar}>menu</span>
          
      </div>
      
      <div className={`sidebar1 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Link to="">Consult Nutritionists</Link>
        <Link to="">Inbox</Link>
        <Link to="">My Bookmark</Link>
        <Link to="">My Followings</Link>
        <Link to="">Edit Profile</Link>
       
      </div>
     
      
    </nav>
  );
};

export default Navbar;
