"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import * as api from "@/app/api";
import Login from "@/app/components/authentication/Login";
import Registration from "@/app/components/authentication/Registration";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { io } from "socket.io-client";

export default function Authentication({}) {
  const [isRegistration, setIsRegistration] = useState<boolean>(true);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

  const { setUser, setUserLoading } = useUserContext();
  const { addNotification } = useNotificationContext();
  const { setSocket } = useSocketContext();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);

    if (isRegistration) {
      api
        .registration(username, email, password)
        .then((response) => {
          if (response?.data?.status === "success") {
            setIsRegistration(false);
            return api.getUser();
          }
        })
        .then((response) => {
          if (response?.data?.status === "success") {
            setUser(response.data.data);
            const socketIo = io("/", {
              path: "/api/socket",
              withCredentials: true,
            });
            setSocket(socketIo);
            router.push("/posts");
          }
        })
        .catch(() => {
          addNotification({
            status: "error",
            message: "An error occurred during authentication.",
          });
        })
        .finally(() => setUserLoading(false));
    } else if (isForgotPassword) {
      api
        .forgotPassword(email)
        .then((response) => {
          if (response?.data?.status === "success") {
            setIsForgotPassword(false);
          }
        })
        .catch(() => {
          addNotification({
            status: "error",
            message: "An error occurred during authentication.",
          });
        })
        .finally(() => setUserLoading(false));
    } else {
      api
        .login(username, password)
        .then((response) => {
          if (response?.data?.status === "success") {
            return api.getUser();
          }
        })
        .then((response) => {
          if (response?.data?.status === "success") {
            setUser(response.data.data);
            const socketIo = io("/", {
              path: "/api/socket",
              withCredentials: true,
            });
            setSocket(socketIo);
            router.push("/posts");
          }
        })
        .catch(() => {
          addNotification({
            status: "error",
            message: "An error occurred during authentication.",
          });
        })
        .finally(() => setUserLoading(false));
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
    "mx-auto flex flex-col items-center justify-center h-[85vh] md:h-[90vh]";
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
