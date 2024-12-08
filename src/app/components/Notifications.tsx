// ./src/app/components/Notifications.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { Notification } from "@/app/types/global";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function NotificationComponent() {
  const { notifications, removeNotification } = useNotificationContext();
  const router = useRouter();
  const audioRef = useRef(null);

  const playSound = (notification: Notification) => {
    const link = notification?.sound;

    if (audioRef.current && notification.soundRequired) {
      notification.soundRequired = false;
      if (link) {
        audioRef.current.src = link; //TODO ROMA FIX
      }
      audioRef.current.play();
    }
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      playSound(notification);
    });
    const timers = notifications.map((notification) =>
      setTimeout(
        () => {
          removeNotification(notification.id);
        },
        notification.time ? notification.time : 3000
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  // Функция для получения класса уведомления в зависимости от статуса и кликабельности
  const getNotificationClassName = (
    status: Notification["status"],
    clickable: boolean
  ) =>
    `notification p-4 rounded-lg shadow-md ${
      clickable ? "cursor-pointer" : ""
    } ${
      status === "success"
        ? "bg-green-500 dark:bg-green-500"
        : status === "error"
        ? "bg-red-500 dark:bg-red-500"
        : status === "info"
        ? "bg-blue-500 dark:bg-blue-500"
        : "bg-yellow-500 dark:bg-yellow-500"
    } text-white flex items-center relative`;

  // Функция для получения иконки уведомления в зависимости от статуса
  const getNotificationIcon = (status: Notification["status"]) => {
    switch (status) {
      case "success":
        return <FaCheckCircle className="w-6 h-6 mr-3" />;
      case "error":
        return <FaExclamationCircle className="w-6 h-6 mr-3" />;
      case "info":
        return <FaInfoCircle className="w-6 h-6 mr-3" />;
      case "warning":
        return <FaExclamationTriangle className="w-6 h-6 mr-3" />;
      default:
        return null;
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <div
      id="notification-container"
      className="fixed bottom-4 right-4 z-72 flex flex-col space-y-2 w-full max-w-sm md:max-w-md"
      aria-live="assertive"
      aria-atomic="true"
    >
      <AnimatePresence>
        {notifications.slice(0, 6).map((notification) => (
          <motion.div
            key={notification.id} // Уникальный ключ
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <audio
              ref={audioRef}
              src="https://storage.yandexcloud.net/pinpictures/sounds/notification.wav"
              preload="auto"
            />
            <div
              className={`${getNotificationClassName(
                notification.status,
                notification.clickable
              )}`}
              onClick={
                notification.clickable && notification.link_to
                  ? () => {
                      if (notification.link_to) {
                        router.push(notification?.link_to);
                        removeNotification(notification.id);
                      }
                    }
                  : undefined
              }
              role="alert"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  notification.clickable &&
                  notification.link_to &&
                  (e.key === "Enter" || e.key === " ")
                ) {
                  router.push(notification.link_to);
                  removeNotification(notification.id);
                }
              }}
            >
              {getNotificationIcon(notification.status)}
              <span className="flex-1">{notification.message}</span>
              <button
                className="ml-4 text-white focus:outline-none absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                aria-label="Закрыть уведомление"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
