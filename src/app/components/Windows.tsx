import React from "react";
import { useWindowContext } from "@/app/contexts/WindowContext";
import Window from "./Window";

export default function Windows({ mouseDown, mousePosition }) {
  const { windows } = useWindowContext();

  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          windowData={window}
          mouseDown={mouseDown}
          mousePosition={mousePosition}
        />
      ))}
    </>
  );
}
