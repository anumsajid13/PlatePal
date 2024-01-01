import React from 'react';
import './NutritionistPopup.css';

const NutritionistPopup = ({ nutritionist, onClose, isFollowingNut = false,onToggleFollow }) => {
  return (
    <div className="nutritionist-popup">
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <img
          src={nutritionist.profilePicture}
          alt={`Nutritionist ${nutritionist.name}`}
          className="popup-image"
        />
        <div className="popup-details">
          <h3 className="popup-details-h3">{nutritionist.name}</h3>
          <h4>{nutritionist.email}</h4>
          <p>{nutritionist.description}</p>
          <button className="popup-details-button" 
           onClick={onToggleFollow}>
             {isFollowingNut && 'Following'}
            {!isFollowingNut && 'Follow Chef'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionistPopup;
