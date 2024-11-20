import React, { useState } from "react";
import Windows from "./Windows";

export default function Main() {

  return (
    <main
      className="w-full h-5/6 left-0 right-0 top-1/5 fixed mx-auto my-auto"
    >
      <Windows />
    </main>
  );
}
