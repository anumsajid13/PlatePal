// Navbar.js
import { Link } from 'react-router-dom';
import { React, useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeLink }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log("TOGGLE");
    console.log(activeLink);
  };

  return (
    <nav className="navbar1">
      <div className="logo">Plate Pal</div>
      <div className="nav-links1">
        <Link
          to="http://localhost:3000/recipe-seeker/Discover"
          className={activeLink === 'Discover' ? 'active-link-1' : ''}
        >
          Discover
        </Link>
        <Link to="/my-feed" className={activeLink === 'My Feed' ? 'active-link-1' : ''}>
          My Feed
        </Link>
        <Link to="/sign-out" className={activeLink === 'Sign Out' ? 'active-link-1' : ''}>
          Sign Out
        </Link>
      </div>
      <div className={`sidebar1 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Link to="">Consult Nutritionists</Link>
        <Link to="">Inbox</Link>
        <Link to="">My Bookmark</Link>
        <Link to="">My Followings</Link>
        <Link to="">Edit Profile</Link>
      </div>

      <div className="icon-link-1" title="Open Sidebar" onClick={toggleSidebar}>
        <h1> </h1>
      </div>
    </nav>
  );
};

export default Navbar;
