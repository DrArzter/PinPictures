// ./src/app/providers.tsx
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/SocketContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ModalsProvider } from "./contexts/ModalsContext";
import ModalManager from "./components/ModalManager";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" enableSystem={true} defaultTheme="system">
      <NotificationProvider>
        <SocketProvider>
          <UserProvider>
            <LoadingProvider>
              <ModalsProvider>
                {children}
                <ModalManager />
              </ModalsProvider>
            </LoadingProvider>
          </UserProvider>
        </SocketProvider>
      </NotificationProvider>
    </NextThemesProvider>
  );
}
