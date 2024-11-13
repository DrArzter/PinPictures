"use client";
import React from "react";

import { NotificationProvider } from "./contexts/NotificationContext";
import { WindowProvider } from "./contexts/WindowContext";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/SocketContext"; // Import SocketProvider
import ContentLoader from "@/app/components/ContentLoader";

export default function Page() {
  return (
    <NotificationProvider>
      <SocketProvider>
        <UserProvider>
          <WindowProvider>
            <ContentLoader />
          </WindowProvider>
        </UserProvider>
      </SocketProvider>
    </NotificationProvider>
  );
}
