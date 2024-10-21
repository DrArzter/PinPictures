import React from "react";

export default function NotFound() {

  const containerClassName = `flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full `;

  const errorHeaderClassName = `w-full lg:w-5/6 p-6 rounded-lg `;

  const errorContentClassName = `w-full lg:w-5/6 p-6 rounded-lg mt-4`;

  const linkClassName = `hover-transform hover:underline cursor-pointer`;

  return (
    <div className={containerClassName}>
      <div className={errorHeaderClassName}>
        <h1 className="text-5xl font-bold text-center mb-4">Error 404</h1>
        <h2 className="text-3xl font-bold text-center mb-4">Page Not Found</h2>
      </div>
      <div className={errorContentClassName}>
        <p className="text-center mb-4">
          If you have any questions or concerns, please contact me at <a className={linkClassName} href="https://github.com/DrArzter">GitHub</a>.
        </p>
      </div>
    </div>
  );
}