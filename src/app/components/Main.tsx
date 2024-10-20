"use client";
import React, { useEffect, useState } from "react";

import Window from "./Window";

export default function Main({ windows, setWindows }) {
  const [mouseDown, setMouseDown] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState(false);
  const [mouseClickTarget, setMouseClickTarget] = React.useState(false);

  function debug(event) {
    setMouseClickTarget(event.target);
  }

  return (
    <main
      className="w-full h-5/6 left-0 right-0 top-1/5 fixed mx-auto my-auto"
      onMouseMove={(event) => setMousePosition(event)}
      onClick={debug}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
    >
      {windows.map((window: any) => (
        <Window
          key={window.id}
          window={window}
          windows={windows}
          setWindows={setWindows}
          mouseDown={mouseDown}
          mousePosition={mousePosition}
          mouseClickTarget={mouseClickTarget}
        />
      ))}
    </main>
  );
}
