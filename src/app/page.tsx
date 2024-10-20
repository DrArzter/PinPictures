"use client";
import React, { useState } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";


export default function Home() {
  const [windows, setWindows] = React.useState<Window[]>([]);
  return (
    <div className="items-center justify-center min-h-screen">
      <Header />
      <Main windows={windows} setWindows={setWindows} />
      <Footer windows={windows} setWindows={setWindows} />
    </div>
  );
}
