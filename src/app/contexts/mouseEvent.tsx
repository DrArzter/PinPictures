import React, { useEffect, ReactNode, useState, useContext, createContext } from "react";

interface MouseContextType {
  mouseDown: boolean;
}

const MouseContext = createContext<MouseContextType | undefined>(undefined);

interface MouseProviderProps {
  children: ReactNode;
}

export const MouseProvider: React.FC<MouseProviderProps> = ({ children }) => {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => {
      setMouseDown(true);
    };

    const handleMouseUp = () => {
      setMouseDown(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <MouseContext.Provider value={{ mouseDown }}>
      {children}
    </MouseContext.Provider>
  );
};

export const useMouseContext = (): MouseContextType => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMouseContext must be used within a MouseProvider");
  }
  return context;
};
