import React, { useEffect, useState } from 'react';
import './notificationPopup.css';
import useNotificationStore from './NotificationStore'; // Import the Zustand store
import useTokenStore from '../../tokenStore';

const NotificationPopup = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const notifications = useNotificationStore((state) => state.notifications);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulate loading delay (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setLoading(true);
        const response = await fetch('/admin/notifications', {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your authentication token
          },
        });
        const { notifications } = await response.json();
        useNotificationStore.setState({ notifications });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h2>Notifications</h2>
        <button className="close-button" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className="notification-list">
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-item">
              <strong>{notification.user.name}</strong>: {notification.notification_text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
