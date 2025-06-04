"use client";
import axios from "axios";
import {
  notificationService,
  createNotification,
} from "@/app/utils/NotificationService";

const api = axios.create({
  baseURL: `/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    // const { data } = response;
    // if (response) {
    //   switch (response.status) {
    //     default:
    //       if (data.status && data.message) {
    //         notificationService.notify(
    //           createNotification(data.message, data.status)
    //         );
    //       }
    //   }
    // } else {
    //   notificationService.notify(createNotification("Network Error", "error"));
    // }
    return Promise.resolve(response || { status: 0, data: null });
  },
  (error) => {
    const { response } = error;
    // if (response) {
    //   switch (response.status) {
    //     default:
    //       if (response.data.status && response.data.message) {
    //         notificationService.notify(
    //           createNotification(response.data.message, response.data.status)
    //         );
    //       }
    //   }
    // } else {
    //   notificationService.notify(createNotification("Network Error", "error"));
    // }

    return Promise.resolve(response || { status: 0, data: null });
  }
);

export default api;
