import React from 'react';
import './chefGenericPopup.css';

const ChefGenericPopup = ({ message, onClose }) => {
  return (
    <div className="chef-g-popup">
      <div className="chef-g-popup-content">
        <span className="chef-g-close-btn" onClick={onClose}>
          &times;
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChefGenericPopup;
