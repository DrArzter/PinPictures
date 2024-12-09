"use client";
import React from "react";

interface LoginProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  toggleRegistration: () => void;
  toggleForgotPassword: () => void;
}

export default function Login({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  toggleRegistration,
  toggleForgotPassword,
}: LoginProps) {
  const containerClassName = `flex flex-col items-center gap-6 p-8 md:p-36 border rounded-xl shadow-xl`;

  const inputClassName = `w-full p-2 border rounded`;

  const buttonClassName = `w-full py-2 rounded-3xl bg-red-500`;

  return (
    <div className={containerClassName}>
      <div className="text-center">
        <h2 className="text-2xl">Login to PinPictures</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <label className="block text-sm mb-1">email</label>
          <input
            type="text"
            placeholder="Enter your email..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">password</label>
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />
        </div>
        <button type="submit" className={buttonClassName}>
          Login
        </button>
        <button onClick={toggleForgotPassword} className="mt-4">
          Forgot Password?
        </button>
        <button onClick={toggleRegistration} className="mt-2">
          Do not have an account? Sign up
        </button>
      </form>
    </div>
  );
}
