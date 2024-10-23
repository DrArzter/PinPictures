"use client";
import React from "react";

import { NotificationProvider } from "./contexts/NotificationContext";
import { WindowProvider } from "./contexts/WindowContext";
import { UserProvider } from "./contexts/userContext";
import ContentLoader from "@/app/components/ContentLoader";

export default function page() {
  return (
    <NotificationProvider>
      <UserProvider>
        <WindowProvider>
          <ContentLoader /> 
        </WindowProvider>
      </UserProvider>
    </NotificationProvider>
  );
}