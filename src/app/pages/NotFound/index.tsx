import React from "react";

export default function NotFound({windowHeight, windowWidth}) {
  // Main container centered on the screen
  const containerClassName = `flex flex-col items-center justify-center`;

  const errorHeaderClassName = `p-6 rounded-lg text-center`;

  const errorContentClassName = `p-6 rounded-lg mt-4 text-center`;

  const linkClassName = `hover:underline cursor-pointer text-blue-600`;

  return (
    <div className={containerClassName} style={{height: `${windowHeight - 55}px`, width: windowWidth}}>
      <div className={errorHeaderClassName}>
        <h1 className="text-5xl font-bold mb-4">Error 404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      </div>
      <div className={errorContentClassName}>
        <p className="mb-4">
          If you have any questions or concerns, please contact me on <a className={linkClassName} href="https://github.com/DrArzter" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      </div>
    </div>
  );
}
