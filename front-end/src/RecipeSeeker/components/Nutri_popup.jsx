import React from 'react';
import './NutritionistPopup.css';

const NutritionistPopup = ({ nutritionist, onClose, onFollow }) => {
  return (
    <div className="nutritionist-popup">
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <img
          src={nutritionist}
          alt={`Nutritionist ${nutritionist.name}`}
          style={{ width: '80px', height: '80px', borderRadius: '40px' }}
        />
        {console.log(nutritionist._id)}
        <h3>{nutritionist.name}</h3>
        <h3>{nutritionist.isBlocked}</h3>
        <p>{nutritionist.description}</p>
        <button onClick={() => onFollow(nutritionist._id)}>Follow</button>
      </div>
    </div>
  );
};

export default NutritionistPopup;
