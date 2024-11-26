"use client";

import React, { useEffect, useState } from "react";
import { FaRegMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";

const ChangeTheme: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Ждем, пока тема не будет доступна

  const currentTheme = theme === "system" ? systemTheme : theme; // Учитываем системную тему

  return (
    <div
      title="Toggle Theme"
      tabIndex={-1}
      className="flex items-center gap-2 cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-0 no-select"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      <div
        className={`relative w-16 h-8 rounded-full p-1 flex items-center transition-colors duration-300 ${
          currentTheme === "dark"
            ? "bg-darkModeSecondaryBackground"
            : "bg-lightModeSecondaryBackground"
        }`}
      >
        <div
          className={`absolute w-7 h-7 rounded-full shadow-md transition-all duration-300 ease-in-out ${
            currentTheme === "dark"
              ? "translate-x-8 bg-darkModeText"
              : "translate-x-0 bg-lightModeText"
          }`}
        >
          {currentTheme === "dark" ? (
            <FaRegMoon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-500" />
          ) : (
            <FaSun className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeTheme;
