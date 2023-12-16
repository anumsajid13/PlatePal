// NotificationPopup.js
import React from 'react';
import './notificationPopup.css';

const NotificationPopup = ({ onClose }) => {
  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h2>Notifications</h2>
        <button className="close-button" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className="notification-list">
        {/* Add your notification items here */}
        <div className="notification-item">Notification 1</div>
        <div className="notification-item">Notification 2</div>
        {/* ... */}
      </div>
    </div>
  );
};

export default NotificationPopup;
