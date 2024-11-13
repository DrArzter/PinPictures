import React, { useContext, useState, useCallback } from "react";
import { getComponentByPath } from "@/app/utils/getComponentByPath";
import { Window, WindowContextType } from "@/app/types/global";

const WindowContext = React.createContext<WindowContextType | undefined>(undefined);

let globalWindowId = 1;

export const WindowProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>([]);

  const addWindow = useCallback(
    (window: Window) => {
      window.layer = Math.max(...windows.map((w) => w.layer), 0) + 1;
      if (window.layer === Infinity || window.layer === -Infinity || isNaN(window.layer)) {
        window.layer = 1;
      }
      setWindows((prevWindows) => [...prevWindows, window]);
    },
    [windows]
  );

  const openWindowByPath = useCallback(
    (path: string) => {
      const existingWindow = windows.find((w) => w.path === path);
      console.log(path);
      if (existingWindow) {
        console.log(`Window for path "${path}" is already open.`);
        return;
      }

      const windowId = globalWindowId++;
      const existingWindowsCount = windows.length;

      const newWindow = getComponentByPath(path, windowId, existingWindowsCount);
      if (newWindow) {
        newWindow.layer = Math.max(...windows.map((w) => w.layer), 0) + 1;
        addWindow(newWindow);
      }
    },
    [windows]
  );

  const updateWindowPath = useCallback((windowId: number, newPath: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((w) => (w.id === windowId ? { ...w, path: newPath } : w))
    );
  }, []);

  const removeWindow = useCallback((id: number) => {
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

export const useWindowContext = (): WindowContextType => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindowContext must be used within a WindowProvider");
  }
  return context;
};
