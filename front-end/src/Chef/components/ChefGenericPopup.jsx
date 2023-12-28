import React from 'react';
import './chefGenericPopup.css';

const ChefGenericPopup = ({ message, onClose }) => {
  return (
    <div className="chef-g-popup-overlay">
      <div className="chef-g-popup">
        <span className="chef-g-close-btn" onClick={onClose}>
          &times;
        </span>
        <div className="chef-g-popup-content">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChefGenericPopup;
