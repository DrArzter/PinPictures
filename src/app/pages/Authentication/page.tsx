'use client';
import React, { useState, useContext } from "react";

import * as api from "../../api";

import Login from "../../components/Login";
import Registration from "../../components/Registration";

export default function Authentication({ }) {
  const [registration, setRegistration] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userData;
      if (registration) {
        userData = await api.registration(username, email, password);
        setRegistration(false);
      } else if (forgotPassword) {
        setForgotPassword(false);
      } else {
        userData = await api.login(username, password);
      }
      setUser(userData);
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const toggleRegistration = () => {
    setRegistration(!registration);
    setForgotPassword(false);
    setUsername("");
    setPassword("");
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setRegistration(false);
    setUsername("");
    setPassword("");
  };

  const containerClassName = "flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full";

  return (
    <div className={containerClassName}>
      {registration ? (
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
      ) : forgotPassword ? (
        <div>
          <p>Forgot Password</p>
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