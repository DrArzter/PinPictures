// ./src/app/contexts/SocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { Notification } from "@/app/types/global";

// Интерфейс для значений контекста
interface SocketContextType {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

// Кастомный хук для использования SocketContext
export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

// Интерфейс для пропсов SocketProvider
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { addNotification } = useNotificationContext(); // Достаем функцию addNotification

  useEffect(() => {
    const socketIo = io("http://localhost:3000");

    socketIo.on("connect", () => {
      console.log("Successfully connected to server Socket.IO");
    });

    socketIo.on("notification", (Notification: Notification) => {
      addNotification(Notification as Notification);
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from server Socket.IO");
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [addNotification]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
