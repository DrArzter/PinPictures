import React, { useState, useContext } from "react";

// Create a context for the notifications
const NotificationContext = React.createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Method to add a notification
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };

  // Method to remove a notification by index
  const removeNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotificationContext = () => useContext(NotificationContext);
