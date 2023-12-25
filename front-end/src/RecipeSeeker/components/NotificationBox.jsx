// NotificationBox.js
import React, { useState, useEffect } from 'react';
import './NotificationBox.css';


const NotificationBox = ({ notifications, onClose }) => {
  return (
    <div className="notification-box">
      <div className="notification-header">
        <span>Notifications</span>
        
      </div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <span className="notification-text">{notification.notification_text}</span>
            <span className="notification-time">{new Date(notification.Time).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationBox;
