"use client";
import React, {
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Notification } from "@/app/types/global";
import { notificationService } from "@/app/utils/NotificationService";
import { v4 as uuidv4 } from "uuid";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = uuidv4();
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { ...notification, id },
      ]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  useEffect(() => {
    notificationService.setNotificationCallback(addNotification);
    return () => {
      notificationService.setNotificationCallback(() => {});
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
