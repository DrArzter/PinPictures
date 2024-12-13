// ./src/app/chats/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import ChatList from "@/app/components/chat/ChatList";
import { useUserContext } from "@/app/contexts/UserContext";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { AdminChat } from "@/app/types/global";
import { Socket } from "socket.io-client";
import { IoIosArrowBack } from "react-icons/io";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user || !socket) return;

    socket.emit("getUserChats");

    socket.on("userChats", (userChats: AdminChat[]) => {
      setChats(userChats);
    });

    socket.on("newChat", (newChat: AdminChat) => {
      newChat.usersInChats = newChat.usersInChats;
      setChats((prevChats) => [...prevChats, newChat]);
    });

    return () => {
      socket.off("userChats");
      socket.off("newChat");
    };
  }, [socket, user]);

  return (
    <>
      {/* Mobile version */}
      <div className="flex flex-row w-full h-[90vh] md:hidden">
        {selectedChatId === undefined && user && socket && (
          <ChatList
            user={user}
            chats={chats}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            socket={socket as Socket}
          />
        )}
        {selectedChatId !== undefined && (
          <
          <div className="flex-grow p-6 overflow-hidden">
            <button
              onClick={() => setSelectedChatId(undefined)}
              className=""
              aria-label="Close Chat"
            >
              <IoIosArrowBack className="w-6 h-6" />
            </button>
            {children
            }</div>
        )}
      </div>

      {/* Desktop version */}
      <div className="flex flex-row w-full:h-[80vh] p-6 hidden md:flex">
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

        <div className="flex-grow p-6 overflow-hidden">{children}</div>
      </div>
    </>
  );
}
