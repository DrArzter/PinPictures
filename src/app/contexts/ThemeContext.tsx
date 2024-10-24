import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => { },
  isMobile: false,
  setIsMobile: () => { },
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isDarkModeStorage = localStorage.getItem("DarkTheme");
    if (isDarkModeStorage === "1") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("DarkTheme", isDarkMode ? "0" : "1");
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isMobile }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;