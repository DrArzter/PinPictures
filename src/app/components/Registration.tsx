"use client";
import React, { useContext } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Registration = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  toggleRegistration,
}) => {
  const containerClassName = `flex flex-col items-center w-full max-w-md gap-6 p-8 sm:p-16`;

  const inputClassName = `w-full p-2 border rounded text-lightModeText`;

  const buttonClassName = `w-full py-2 rounded-3xl bg-red-500`;

  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <div className={containerClassName}>
      <div className="text-center">
        <h2 className="text-2xl">Welcome to PinPictures</h2>
        <p>Join us and explore the community!</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />
        </div>
        <ReCAPTCHA sitekey="your-site-key" onChange={onCaptchaChange} />
        <button type="submit" className={buttonClassName}>
          Sign up
        </button>
        <button type="button" onClick={toggleRegistration} className="mt-2">
          Already have an account?
        </button>
      </form>
    </div>
  );
};

export default Registration;