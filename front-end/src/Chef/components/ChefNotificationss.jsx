import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import './chefNotifications.css';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../url';

const ChefNotificationBox = () => {
  const [notifications, setNotifications] = useState([]);

  //const { token, setToken } = useTokenStore(); 

  const token = localStorage.getItem('token');
    console.log('notificationnn',token)
  useEffect(() => {
    //fetch notifications 
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASE_URL}/chef/notifications`, {
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

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/chef/deletenotifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      const updatedNotifications = notifications.filter((notification) => notification._id !== id);
      setNotifications(updatedNotifications);
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
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Link
              className='chef-linkss'
              key={index}
              to={
                notification.type === 'follow'
                  ? '/Chef/myFollowers'
                  : notification.type === 'message from recipe seeker'
                  ? '/Chef/usersInbox'
                  : notification.type === 'message'
                  ? '/Chef/vendorsInbox'
                  : notification.type === 'unfollow'
                  ? '/Chef/myFollowers'
                  : notification.type === 'comment'
                  ? '/Chef/Mainpage'
                  : notification.type === 'review'
                  ? '/Chef/AllReviews'
                  : notification.type === 'Request accepted'
                  ? '/Chef/AllCollabs'
                  : '#'
              }
            >
              <div className="notification-item">
                <span className="material-icons"
                  onClick={() => handleDeleteNotification(notification._id)}
                >
                  close
                </span>
                <span className="notification-text">{notification.notification_text}</span>
                <span className="notification-time">{new Date(notification.Time).toLocaleString()}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="notification-item">
            <span>No notifications</span>
          </div>
        )}
      </div>
    </div>

  );
};

export default ChefNotificationBox;
