"use client";
import React, { useState } from "react";

import Notification from "./components/Notifications";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

import { NotificationProvider } from "./contexts/NotificationContext";
import { WindowProvider } from "./contexts/WindowContext";
import { UserProvider } from "./contexts/userContext";



export default function Home() {
  return (
    <div className="items-center justify-center min-h-screen">
      <UserProvider>
      <WindowProvider>
          <NotificationProvider>
            <Header />
            <Notification />
            <Main />
            <Footer />
          </NotificationProvider>
      </WindowProvider>
      </UserProvider>
    </div>
  );
}
