"use client";
import React from "react";

import Main from "./main";
import { NotificationProvider } from "./contexts/NotificationContext";
import { WindowProvider } from "./contexts/WindowContext";
import { UserProvider } from "./contexts/userContext";

export default function Home() {


  return (
    <NotificationProvider>
      <UserProvider>
        <WindowProvider>
            <Main />
        </WindowProvider>
      </UserProvider>
    </NotificationProvider>
  );
}
