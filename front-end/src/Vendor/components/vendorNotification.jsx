import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import { Link } from 'react-router-dom';

const VendorNotificationBox = () => {
  const [notifications, setNotifications] = useState([]);
  const { token, setToken } = useTokenStore(); 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:9000/vendor/notifications', {
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
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, [token]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:9000/vendor/notifications/${notificationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update the state to reflect the change
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="notification-box">
      <div className="notification-header">
        <span>Notifications</span>
      </div>
      <div className="notification-list">
        {notifications &&
          notifications.map((notification, index) => (
            <Link
              className="chef-linkss"
              key={index}
              to={
                notification.type === 'Collab Request'
                  ? '/vendor/CollaborationRequest'
                  : notification.type === 'message'
                  ? '/vendor/inbox'
                  : '#'
              }
              onClick={() => markNotificationAsRead(notification._id)} 
            >
              <div className="notification-item">
                <span className="notification-text">{notification.notification_text}</span>
                <span className="notification-time">{new Date(notification.Time).toLocaleString()}</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default VendorNotificationBox;
