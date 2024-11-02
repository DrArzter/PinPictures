'use client';
import React, { useState } from "react";

import * as api from "@/app/api";

import Login from "../../components/Login";
import Registration from "../../components/Registration";

import { useNotificationContext } from '@/app/contexts/NotificationContext';
import { useUserContext } from '@/app/contexts/UserContext';
import { useWindowContext } from '@/app/contexts/WindowContext';

export default function Authentication({windowId}) {

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
        if (response.status === "success") {
          setIsRegistration(false);
          setUser(response.user);
          removeWindow(windowId);
        }
      } else if (isForgotPassword) {
        response = await api.forgotPassword(email);
        if (response.status === "success") {
          setIsForgotPassword(false);
        }
      } else {
        setUserLoading(true);
        response = await api.login(username, password);
        if (response.status === "success") {
          const userData = await api.getUser();
          setUser(userData);
          removeWindow(windowId);
        }
        setUserLoading(false);
      }

      addNotification({
        status: response.status,
        message: response.message,
      });
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const toggleRegistration = () => {
    setIsRegistration(!isRegistration);
    setIsForgotPassword(false);
    setUsername("");
    setPassword("");
  };

  // Функция переключения на восстановление пароля
  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsRegistration(false);
    setUsername("");
    setPassword("");
  };

  const containerClassName = "flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full";

  return (
    <div className={containerClassName}>
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
        <div>
          <p>Enter your email to reset password</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <button type="submit">Reset Password</button>
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
