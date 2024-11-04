// WindowContext.tsx
import React, { useContext, useState, useCallback } from "react";
import { getComponentByPath } from "@/app/utils/getComponentByPath";

const WindowContext = React.createContext();

let globalWindowId = 1;

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);

  const addWindow = useCallback((window) => {
    window.layer = Math.max(...windows.map(w => w.layer), 0) + 1;
    if (window.layer === Infinity || window.layer === -Infinity || isNaN(window.layer)) {
      window.layer = 1;
    }
    setWindows((prevWindows) => [...prevWindows, window]);
  }, [windows]);

  const openWindowByPath = useCallback((path) => {
    const existingWindow = windows.find((w) => w.path === path);
    console.log(path)
    if (existingWindow) {
      console.log(`Window for path "${path}" is already open.`);
      return;
    }

    const windowId = globalWindowId++;
    const existingWindowsCount = windows.length;

    let newWindow = getComponentByPath(path, windowId, existingWindowsCount);
    newWindow.layer = Math.max(...windows.map(w => w.layer), 0) + 1;
    if (newWindow) {
      addWindow(newWindow);
    }
  }, [windows]);

  const updateWindowPath = useCallback((windowId, newPath) => {
    setWindows((prevWindows) =>
      prevWindows.map((w) => (w.id === windowId ? { ...w, path: newPath } : w))
    );
  }, []);

  const removeWindow = useCallback((id) => {
    setWindows((prevWindows) => prevWindows.filter((w) => w.id !== id));
  }, []);

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
