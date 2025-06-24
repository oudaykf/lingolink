import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import './NotificationManager.css';

// Create a global notification system
let notifyFunction = () => {};

// Function to add a new notification
export const notify = (message, type = 'info', duration = 5000) => {
  notifyFunction({ message, type, duration, id: Date.now() });
};

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Set the global notify function
    notifyFunction = (notification) => {
      setNotifications(prev => [...prev, notification]);
    };

    return () => {
      notifyFunction = () => {};
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
