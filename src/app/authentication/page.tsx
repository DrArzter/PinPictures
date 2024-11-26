"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import * as api from "@/app/api";
import Login from "@/app/components/authentication/Login";
import Registration from "@/app/components/authentication/Registration";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { io } from "socket.io-client";

export default function Authentication({}) {
  const [isRegistration, setIsRegistration] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { setUser, setUserLoading } = useUserContext();
  const { addNotification } = useNotificationContext();
  const { setSocket } = useSocketContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;

      if (isRegistration) {
        response = await api.registration(username, email, password);
        if (response && response.status === "success") {
          setIsRegistration(false);
          setUser(response.user);
          router.push("/posts");
        }
        setUserLoading(false);
      } else if (isForgotPassword) {
        response = await api.forgotPassword(email);
        if (response && response.status === "success") {
          setIsForgotPassword(false);
        }
      } else {
        setUserLoading(true);
        response = await api.login(username, password);
        if (response && response.status === "success") {
          const userData = await api.getUser();
          setUser(userData);
          router.push("/posts");
        }
        setUserLoading(false);
      }

      if (response && response.status === "success") {
        const socketIo = io("http://localhost:3000");
        setSocket(socketIo);

        addNotification({
          status: response.status,
          message: response.message,
          time: 5000,
          clickable: false,
        });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
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

  const containerClassName =
    "mx-auto flex flex-col items-center justify-center h-[90vh]";
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
              className="bg-blue-500 font-semibold py-2 px-4 rounded hover:bg-blue-600"
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
