import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoadingIndicator() {
  const spinnerClassName = `text-4xl animate-spin text-yellow-500`;
  return (
    <div className="flex flex-col items-center justify-center">
      <FaSpinner className={spinnerClassName} />
      <span className="text-2xl text-yellow-500 mt-2">PinPictures</span>
    </div>
  );
}
