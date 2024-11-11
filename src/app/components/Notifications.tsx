import React, { useEffect } from "react";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useWindowContext } from "@/app/contexts/WindowContext";

export default function Notification() {
  const { notifications, removeNotification } = useNotificationContext() as any;
  const { openWindowByPath } = useWindowContext() as any;

  useEffect(() => {
    const timers = notifications.map((notification: any, index: number) =>
      setTimeout(
        () => {
          removeNotification(index);
        },
        notification.time ? notification.time : 3000
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  const getNotificationClassName = (status: string, clickable: boolean) =>
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
      className={`fixed bottom-2 right-4 z-[999] space-y-2 w-1/6`}
    >
      {notifications.slice(0, 6).map((notification: any, index: number) => (
        <div
          key={index}
          className={`${getNotificationClassName(
            notification.status,
            notification.clickable
          )} backdrop-blur-md bg-opacity-30 rounded-md border-2 text-center py-4 shadow-lg`}
          onClick={
            notification.clickable
              ? () => openWindowByPath(notification.link_to)
              : undefined // Use undefined instead of null
          }
        >
          <p className="text-white">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
