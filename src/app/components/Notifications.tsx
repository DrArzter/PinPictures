import React, { useEffect } from "react";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { Notification } from "@/app/types/global"; // Импортируем интерфейс Notification из global.ts

export default function NotificationComponent() {
  const { notifications, removeNotification } = useNotificationContext() as {
    notifications: Notification[];
    removeNotification: (index: number) => void;
  };

  const { openWindowByPath } = useWindowContext() as {
    openWindowByPath: (path: string) => void;
  };

  useEffect(() => {
    const timers = notifications.map((notification, index) =>
      setTimeout(
        () => {
          removeNotification(index);
        },
        notification.time ? notification.time : 3000
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  // Функция для получения класса уведомления в зависимости от статуса и кликабельности
  const getNotificationClassName = (status: Notification["status"], clickable: boolean) =>
    `notification p-4 rounded-2xl shadow-2xl mt-2 ${
      clickable ? "cursor-pointer" : ""
    } ${
      status === "success"
        ? "bg-green-500"
        : status === "error"
        ? "bg-red-500"
        : status === "info"
        ? "bg-white"
        : "bg-yellow-500"
    }`;

  return (
    <div
      id="notification-container"
      className="fixed bottom-2 right-4 z-[999] space-y-2 w-1/6"
    >
      {notifications.slice(0, 6).map((notification, index) => (
        <div
          key={index}
          className={`${getNotificationClassName(
            notification.status,
            notification.clickable
          )} backdrop-blur-md bg-opacity-30 rounded-md border-2 text-center py-4 shadow-lg`}
          onClick={
            notification.clickable && notification.link_to !== undefined
              ? () => openWindowByPath(notification.link_to as string)
              : undefined
          }
        >
          <p className="text-white">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
