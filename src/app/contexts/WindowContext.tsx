import React, { useState, useContext, useEffect } from "react";

import { getComponentByPath } from "@/app/utils/getComponentByPath";

const WindowContext = React.createContext();

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = React.useState<Window[]>([]);


  const addWindow = (window: Window) => {
    setWindows((prevWindows) => [...prevWindows, window]);
  };

  const openTrustedWindow = (path: string) => {
    console.log(windows.length + 1)
    const component = getComponentByPath(path, windows.length + 1);
    if (component) {
      addWindow(component);
    } else {
      console.error(`Component not found for path: ${path}`);
      return null;
    }
  }

  const removeWindow = (id) => {
    setWindows((prevWindows) =>
      prevWindows.filter((w, _) => w.id !== id)
    );
  };

 
  return (
    <WindowContext.Provider value={{ windows, addWindow, removeWindow, setWindows, openTrustedWindow }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => useContext(WindowContext);
