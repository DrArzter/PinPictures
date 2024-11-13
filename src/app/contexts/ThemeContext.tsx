import React, { createContext, useState, useEffect, ReactNode } from "react";

// Интерфейс для значений контекста
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Создаем контекст с типами по умолчанию
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
