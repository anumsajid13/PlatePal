import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/navBar.css';
import Sidebar from '../components/sidebar';

const NavigationBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const handleSidebarToggle = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const handleSidebarClose = () => {
      setIsSidebarOpen(false);
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
            
        </nav>
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </>
    );
  };
  
export default NavigationBar;

