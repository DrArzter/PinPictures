// ./src/app/chats/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import ChatList from "@/app/components/chat/ChatList";
import { useUserContext } from "@/app/contexts/UserContext";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { Chat } from "@/app/types/global";
import { Socket } from "socket.io-client";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user || !socket) return;

    // Предположим, что сервер умеет отдавать список чатов пользователя по событию "getUserChats"
    socket.emit("getUserChats");

    socket.on("userChats", (userChats: Chat[]) => {
      setChats(userChats);
    });

    socket.on("newChat", (newChat: Chat) => {
      newChat.users = newChat.UsersInChats
      setChats((prevChats) => [...prevChats, newChat]);
    });

    return () => {
      socket.off("userChats");
      socket.off("newChat");
    };
  }, [socket, user]);

  return (
    <div className="flex flex-row w-full h-[90vh] md:h-[80vh] p-6">
      <div className="w-1/4 h-full p-4 border-r overflow-hidden flex flex-col">
        {user && socket && (
          <ChatList
            user={user}
            chats={chats}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            socket={socket as Socket}
          />
        )}
      </div>

      <div className="flex-grow p-6 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
