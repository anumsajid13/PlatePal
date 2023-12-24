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
          <Link to="/vendor/Collaboration">Collaboration</Link>
        </li>
        <li>
          <Link to="/vendor/CollaborationRequest">Collaboration Request</Link>
        </li>
        <li>
     
          <Link to="/Vendor/Mainpage">Products</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
