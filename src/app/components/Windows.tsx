import React from "react";
import Window from "./Window";
import { useWindowContext } from "@/app/contexts/WindowContext";

export default function Windows() {
  const { windows } = useWindowContext();

  return (
    <>
      {windows.map((win) => (
        <Window key={win.id} initialWindowData={win} />
      ))}
    </>
  );
}
