import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';

const ShowSupplierNotificationBox = () => {
  const [supplierNotifications, setSupplierNotifications] = useState([]);
  const { token } = useTokenStore();

  // Define the fetch function
  const fetchSupplierNotifications = async () => {
    try {
      const response = await fetch('http://localhost:9000/vendor/supplierNotify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier notifications');
      }

      const data = await response.json();
      setSupplierNotifications(data);
    } catch (error) {
      console.error('Error fetching supplier notifications:', error);
    }
  };

  useEffect(() => {
    fetchSupplierNotifications();
  }, [token]); 

  return (
    <>
      {supplierNotifications.length === 0 ? (
        <div>No notifications available</div>
      ) : (
        supplierNotifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <span className="notification-text">{notification.message}</span>
            <span className="notification-time">
              {new Date(notification.time).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </>
  );
};

export default ShowSupplierNotificationBox;
