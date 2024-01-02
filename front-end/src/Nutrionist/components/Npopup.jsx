import React, { useEffect, useState } from 'react';
import '../../Admin/components/notificationPopup.css';
import useNotificationStore from './Nstore'; // Import the Zustand store
import useTokenStore from '../../tokenStore';
import { useHistory, useNavigate,useParams } from 'react-router-dom';

const NotificationPopup = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const notifications = useNotificationStore((state) => state.notifications);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/n/unseen-notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
console.log("woo", data)
      useNotificationStore.setState({ notifications: data });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleCreatePlan = async (notificationId,senderId,bmi) => {
    try {
      const response = await fetch(`http://localhost:9000/n/n-createplan/${notificationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }
      const data = await response.json();
      console.log( "boo",data); // Handle the response as needed
    console.log("bmi",data.bmi)
      // Navigate to /n/makeplan/:bmi/:id
      navigate(`/n/makeplan/${bmi}/${senderId}`);
      // Refetch notifications
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const changebool = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:9000/n/n-createplan/${notificationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }
      const data = await response.json();
   
      // Refetch notifications
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleNotificationClick = (notification) => {
    console.log("lll")
    if (!notification.seen) {
      // Call changebool function
      console.log("lll")

      changebool(notification._id);

      console.log(notification.type)


      // Conditionally navigate based on notification type
      if (notification.type === 'follower alert') {
        console.log("fol")

        navigate('/nut/followers');
      } else if (notification.type === 'Message by Recepie Seeker') {
        console.log("nice")

        navigate('/n/chat');
      } else if (notification.type === 'subscription')
      {
        navigate('n/transactions/:nutId');

      }
    }
  };

  return (
    <div className="notification-popup">
      <div className="notification-header1">
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
            <div key={notification._id} className="notification-item"  onClick={() => handleNotificationClick(notification)}>
              <strong>{notification.sender.username}</strong>: {notification.notification_text}  {!notification.seen && notification.type !== 'follower alert' &&  notification.type !== 'Message by Recepie Seeker' &&  notification.type !== 'subscription' && (
                <span className="bmi-text">BMI: {notification.bmi}</span>
              )}
              {!notification.seen && notification.type !== 'follower alert' &&  notification.type !== 'Message by Recepie Seeker' &&   notification.type !== 'subscription' &&(
                <button className="createPlan" onClick={() => handleCreatePlan(notification._id, notification.sender._id, notification.bmi)}>
                  Create Plan
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
