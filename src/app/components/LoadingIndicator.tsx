import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoadingIndicator() {

  const spinnerClassName = `text-4xl animate-spin text-yellow-500`;
  return (
    <div className="flex justify-center items-center w-full">
      <FaSpinner className={spinnerClassName} />
    </div>
  );
}