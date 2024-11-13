// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Интерфейс для значений контекста
interface SocketContextType {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

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

  useEffect(() => {
    // Указываем URL или конфигурацию для `io()`
    const socketIo = io("http://localhost:3000"); // Замените на актуальный URL сервера

    socketIo.on("connect", () => {
      console.log("Successfully connected to server Socket.IO");
    });

    socketIo.on("message", (data) => {
      console.log("Message from server:", data);
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from server Socket.IO");
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
