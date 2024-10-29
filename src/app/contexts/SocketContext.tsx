// contexts/SocketContext.js
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io();

    socketIo.on('connect', () => {
      console.log('Successfully connected to server Socket.IO');
    });

    socketIo.on('message', (data) => {
      console.log('Message from server:', data);
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from server Socket.IO');
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
