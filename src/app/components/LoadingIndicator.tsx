import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoadingIndicator() {

  const spinnerClassName = `text-4xl animate-spin text-yellow-500`;
  return (
    <div style={{ userSelect: "none" }} className="flex flex-col justify-center items-center w-full gap-4">
      <FaSpinner className={spinnerClassName} />
      <span className="text-2xl text-yellow-500">Pin OS</span>
    </div>
  );
}