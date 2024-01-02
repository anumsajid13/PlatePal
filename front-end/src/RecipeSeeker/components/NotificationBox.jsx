// NotificationBox.js
import React, { useState, useEffect } from 'react';
import './NotificationBox.css';
import { Link } from 'react-router-dom';
import NutritionistChat from './NutritionistChat';
import { BASE_URL } from '../../url';

const NotificationBox = ({ notifications, onClose ,handleDeleteNotification}) => {

  const token = localStorage.getItem('token');

  

  return (
    <div className="notification-box-user">
      <div className="notification-header">
        <span>Notifications</span>
        
      </div>
      <div className="notification-list">
      {notifications && notifications.map((notification, index) => (
         <Link  className='chef-linkss'
         key={index} 
         to={
              
              notification.type === 'message from Chef'
             ? '/recipe-seeker/Inbox'
             : notification.type === 'New Recipe Added'
             ? 'recipe-seeker/Discover' 
             : notification.type === 'unfollow'
             ? '#' 
             : notification.type === 'comment'
             ? '#' 
             : notification.type === 'review'
             ? '#' 
             : notification.type === 'Request accepted'
             ? '#' 
             : '#'
         }
       >
         <div className="notification-item">
         <span className="material-icons" 
            onClick={() => handleDeleteNotification(notification._id)}  
            >close</span>
           <span className="notification-text">{notification.notification_text}</span>
            <span className="notification-time">{new Date(notification.Time).toLocaleString()}</span>
            
         </div>
        
       </Link>
    ))}
    </div>
    </div>
  );
};

export default NotificationBox;
