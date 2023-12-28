// PopupMessage.js

import React from 'react';
import './PopupMessage.css';

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup-message">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupMessage;
