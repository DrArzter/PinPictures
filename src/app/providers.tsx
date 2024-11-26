// ./src/app/providers.tsx
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/SocketContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ModalsProvider } from "./contexts/ModalsContext";
import { MenuProvider } from "./contexts/MenuContext";
import ModalManager from "./components/modals/ModalManager";
import MenuManager from "./components/menu/MenuManager";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="system"
    >
      <NotificationProvider>
        <SocketProvider>
          <UserProvider>
            <LoadingProvider>
              <ModalsProvider>
                <MenuProvider>
                  {children}
                  <ModalManager />
                  <MenuManager />
                </MenuProvider>
              </ModalsProvider>
            </LoadingProvider>
          </UserProvider>
        </SocketProvider>
      </NotificationProvider>
    </NextThemesProvider>
  );
}
