"use client";
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RegistrationProps } from "@/app/types/global";

export default function Registration({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  toggleRegistration,
  setRecaptcha
}: RegistrationProps) {


  const containerClassName = `
    flex flex-col items-center gap-6 p-6 md:p-12 
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
    w-full py-3 rounded-lg bg-red-500
    font-semibold hover:bg-red-600 
    transition-all duration-300
  `;

  const onCaptchaChange = (value: string | null) => {
    setRecaptcha(value);
  };

  return (
    <div className={containerClassName}>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome to PinPictures</h2>
        <p className="text-sm">
          Join us and explore the community!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <label className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
            aria-label="Username"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="w-full">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={onCaptchaChange}
            className="flex justify-center"
          />
        </div>

        <button type="submit" className={buttonClassName}>
          Sign up
        </button>

        <button
          type="button"
          onClick={toggleRegistration}
          className="mt-2 text-red-500 hover:underline"
        >
          Already have an account?
        </button>
      </form>
    </div>
  );
}
