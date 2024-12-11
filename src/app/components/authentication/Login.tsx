"use client";
import React from "react";
import { LoginProps } from "@/app/types/global";

export default function Login({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  toggleRegistration,
  toggleForgotPassword,
}: LoginProps) {
  const containerClassName = `
    flex flex-col items-center gap-6 
    p-6 md:p-12 
    md:border rounded-xl shadow-xl 
    w-full max-w-sm
    mx-auto
  `;

  const inputClassName = `
    w-full p-3 border rounded-lg text-sm 
    placeholder-gray-400 focus:ring-2 focus:ring-red-500 
    outline-none
  `;

  const buttonClassName = `
    w-full py-3 rounded-lg bg-red-500 text-white 
    font-semibold hover:bg-red-600 
    transition-all duration-300
  `;

  const linkButtonClassName = `
    text-red-500 text-sm mt-2 hover:underline 
    transition-all duration-300
  `;

  return (
    <div className={containerClassName}>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Login to PinPictures</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
            aria-label="Email"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            aria-label="Password"
          />
        </div>

        <button type="submit" className={buttonClassName}>
          Login
        </button>

        <button
          onClick={toggleForgotPassword}
          type="button"
          className={linkButtonClassName}
        >
          Forgot Password?
        </button>

        <button
          onClick={toggleRegistration}
          type="button"
          className={linkButtonClassName}
        >
          Do not have an account? Sign up
        </button>
      </form>
    </div>
  );
}
