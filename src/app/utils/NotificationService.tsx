import { Notification } from "@/app/types/global";

export class NotificationService {
  private notificationCallback:
    | ((notification: Omit<Notification, "id">) => void)
    | null = null;

  setNotificationCallback(
    callback: (notification: Omit<Notification, "id">) => void
  ) {
    this.notificationCallback = callback;
  }

  notify(notification: Omit<Notification, "id">) {
    if (this.notificationCallback) {
      this.notificationCallback(notification);
    }
  }
}

export const notificationService = new NotificationService();

export const createNotification = (
  message: string,
  status: Notification["status"]
) => ({
  status,
  message,
});

