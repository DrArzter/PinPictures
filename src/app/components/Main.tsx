"use client";
import React, { useEffect, useState } from "react";

import Windows from "./Windows";

export default function Main() {
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
      <Windows mouseDown={mouseDown} mousePosition={mousePosition} />
    </main>
  );
}
