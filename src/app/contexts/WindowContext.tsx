// WindowContext.js
import React, { useContext, useState } from "react";
import { getComponentByPath } from "@/app/utils/getComponentByPath";
import { get } from "http";

const WindowContext = React.createContext();

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);

  const addWindow = (window) => {
    setWindows((prevWindows) => [...prevWindows, window]);
  };

  const openWindowByPath = (path) => {
    const windowId = windows.length + 1;
    const existingWindowsCount = windows.length;

    const newWindow = getComponentByPath(path, windowId, existingWindowsCount);
    if (newWindow) {
      addWindow(newWindow);
    }
  };

  const updateWindowPath = (windowId, newPath) => {
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === windowId ? { ...w, path: newPath } : w
      )
    );
  };

  const removeWindow = (id) => {
    setWindows((prevWindows) => prevWindows.filter((w) => w.id !== id));
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        setWindows,
        addWindow,
        removeWindow,
        openWindowByPath,
        updateWindowPath,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => useContext(WindowContext);
