"use client";
import React from "react";

import Main from "./main";
import { NotificationProvider } from "./contexts/NotificationContext";
import { WindowProvider } from "./contexts/WindowContext";
import { UserProvider } from "./contexts/userContext";

export default function Home() {


  return (
      <UserProvider>
        <WindowProvider>
          <NotificationProvider>
            <Main />
          </NotificationProvider>
        </WindowProvider>
      </UserProvider>
  );
}
