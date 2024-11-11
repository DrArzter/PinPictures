// Windows.tsx
import React from "react";
import Window from "./Window";
import { useWindowContext } from "@/app/contexts/WindowContext";

export default function Windows({ mouseDown, mousePosition } : any) {
  const { windows } = useWindowContext() as any;

  return (
    <div>
      {windows.map((win : any) => (
        <Window
          key={win.id}
          windowData={win}
          mouseDown={mouseDown}
          mousePosition={mousePosition}
        />
      ))}
    </div>
  );
}
