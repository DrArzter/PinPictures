"use client";
import React, { useState } from "react";

import * as api from "@/app/api";

import Login from "../../components/Login";
import Registration from "../../components/Registration";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { useWindowContext } from "@/app/contexts/WindowContext";

interface AuthenticationProps {
  windowId: number;
  windowHeight: number;
  windowWidth: number;
}

export default function Authentication({
  windowId,
  windowHeight,
  windowWidth,
}: AuthenticationProps) {
  const [isRegistration, setIsRegistration] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { removeWindow } = useWindowContext();
  const { setUser, setUserLoading } = useUserContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { addNotification } = useNotificationContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;

      if (isRegistration) {
        response = await api.registration(username, email, password);
        if (response && response.status === "success") {
          // Проверка на наличие response
          setIsRegistration(false);
          setUser(response.user);
          removeWindow(windowId);
        }
      } else if (isForgotPassword) {
        response = await api.forgotPassword(email);
        if (response && response.status === "success") {
          // Проверка на наличие response
          setIsForgotPassword(false);
        }
      } else {
        setUserLoading(true);
        response = await api.login(username, password);
        if (response && response.status === "success") {
          // Проверка на наличие response
          const userData = await api.getUser();
          setUser(userData);
          removeWindow(windowId);
        }
        setUserLoading(false);
      }

      // Убедимся, что response не undefined перед добавлением уведомления
      if (response) {
        addNotification({
          status: response.status,
          message: response.message,
          time: 5000,
          clickable: false,
        });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      // Добавим уведомление об ошибке, если catch блок отработает
      addNotification({
        status: "error",
        message: "An error occurred during authentication.",
        time: 5000,
        clickable: false,
      });
    }
  };

  const toggleRegistration = () => {
    setIsRegistration(!isRegistration);
    setIsForgotPassword(false);
    setUsername("");
    setPassword("");
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsRegistration(false);
    setUsername("");
    setPassword("");
  };

  const containerClassName = "flex flex-col items-center justify-center";

  return (
    <div
      style={{ height: `${windowHeight - 55}px`, width: `${windowWidth}px` }}
      className={containerClassName}
    >
      {isRegistration ? (
        <Registration
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          toggleRegistration={toggleRegistration}
        />
      ) : isForgotPassword ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="mb-4">Enter your email to reset password</p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="mb-4 p-2 border rounded w-64"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
            >
              Reset Password
            </button>
          </form>
        </div>
      ) : (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          toggleRegistration={toggleRegistration}
          toggleForgotPassword={toggleForgotPassword}
        />
      )}
    </div>
  );
}
