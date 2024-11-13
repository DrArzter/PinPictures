"use client";
import React, { useState } from "react";
import Windows from "./Windows";

export default function Main() {
  const [mouseDown, setMouseDown] = useState(false);

  const [mousePosition, setMousePosition] = useState({ clientX: 0, clientY: 0 });

  const [mouseClickTarget, setMouseClickTarget] = useState<EventTarget | null>(null);

  function debug(event: React.MouseEvent) {
    setMouseClickTarget(event.target);
  }

  return (
    <main
      className="w-full h-5/6 left-0 right-0 top-1/5 fixed mx-auto my-auto"
      onMouseMove={(event) => setMousePosition({ clientX: event.clientX, clientY: event.clientY })}
      onClick={debug}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
    >
      <Windows mouseDown={mouseDown} mousePosition={mousePosition} />
    </main>
  );
}
