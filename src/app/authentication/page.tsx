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
import { LuBanana } from "react-icons/lu";

export default function Authentication({ }) {
  const [isRegistration, setIsRegistration] = useState<boolean>(true);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

  const [recaptcha, setRecaptcha] = useState<string | null>(null);

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
      if (!recaptcha) {
        addNotification({
          status: "error",
          message: "Please verify that you are not a robot.",
        });
        setUserLoading(false);
        return;
      }
      api
        .registration(username, email, password, recaptcha)
        .then((response) => {
          if (response?.data?.status === "success") {
            setIsRegistration(false);
            return api.getUser();
          }
          setUserLoading(false);
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
            setUserLoading(false);
          }
        })
        .catch(() => {
          addNotification({
            status: "error",
            message: "An error occurred during authentication.",
          });
          setUserLoading(false);
        })
    } else if (isForgotPassword) {
      api
        .forgotPassword(email)
        .then((response) => {
          if (response?.data?.status === "success") {
            setIsForgotPassword(false);
          }
          setUserLoading(false);
        })
        .catch(() => {
          addNotification({
            status: "error",
            message: "An error occurred during authentication.",
          });
          setUserLoading(false);
        })
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
            setUserLoading(false);
          }
        })
        .catch(() => {
          addNotification({
            status: "error",
            message: "An error occurred during authentication.",
          });
          setUserLoading(false);
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
          setRecaptcha={setRecaptcha}
        />
      ) : isForgotPassword ? (
        <div className="p-6 rounded-lg text-center">
          <div className="banana-rain">
            {Array.from({ length: 50 }).map((_, index) => (
              <LuBanana
                key={index}
                className="banana text-yellow-400 text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <p className="mb-4">Анлак</p>
          <p className="mb-4">Unluck</p>
          <button
            onClick={toggleForgotPassword}
            className="w-full p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300"
          >
            Назад
          </button>
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
