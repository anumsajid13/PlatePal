import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/vendor_sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`vendor_sidebar ${isOpen ? 'open' : ''}`}>
      <div className="close-icon" onClick={onClose}>
        &times;
      </div>
      <ul>
        <li>
        <Link to="/Vendor/Profile">profile</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
     
          <Link to="/Vendor/Mainpage">Products</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
