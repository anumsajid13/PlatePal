import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Import the user icon
import '../assets/styles/navBar.css';
import Sidebar from './vendor_sidebar';
import { useNavigate } from 'react-router-dom';


const NavigationBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  const HandleNav = () => {
navigate('/Vendor/Profile');
  };

  return (
    <>
      <nav className="navbar">
        <div className="sidebar-icon" onClick={handleSidebarToggle}>
          &#9776;
        </div>
        <div className="logo">Plate Pal</div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <div className="profile-icon" >
          <FaUser onClick={HandleNav}/>
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export default NavigationBar;
