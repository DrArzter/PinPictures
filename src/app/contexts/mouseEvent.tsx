import React, { useEffect } from "react";

// Create a context for the mouse state
const MouseContext = React.createContext();

export const MouseProvider = ({ children }) => {
  const [mouseDown, setMouseDown] = React.useState(false);

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

export const useMouseContext = () => React.useContext(MouseContext);
