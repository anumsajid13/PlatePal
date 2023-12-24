import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import './chefNotifications.css';


const ChefNotificationBox = () => {
  const [notifications, setNotifications] = useState([]);

  const { token, setToken } = useTokenStore(); 
    console.log('notificationnn',token)
  useEffect(() => {
    //fetch notifications 
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:9000/chef/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        console.log(data)
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <div className="notification-box">
    
      {notifications && notifications.map((notification, index) => (
        
        <p key={index}>
            {notification.type === 'follow' && '👥 '}
            {notification.type === 'unfollow' && '👥 '}
            {notification.type === 'message from recipe seeker' && '💬 '}
            {notification.notification_text}
        </p>
        
    ))}
    </div>
  );
};

export default ChefNotificationBox;
