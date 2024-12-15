// ./app/chats/layout.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import ChatList from "@/app/components/chat/ChatList";
import { useUserContext } from "@/app/contexts/UserContext";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { AdminChat } from "@/app/types/global";
import { Socket } from "socket.io-client";
import { useSelectedChatStore } from "@/app/useSelectedChatStore";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { selectedChatId, setSelectedChatId } = useSelectedChatStore();
  const chatsRef = useRef<AdminChat[]>([]);
  const [chats, setChats] = useState<AdminChat[]>([]);

  useEffect(() => {
    if (!user || !socket) return;

    socket.emit("getUserChats");

    socket.on("userChats", (userChats: AdminChat[]) => {
      chatsRef.current = userChats;
      setChats([...userChats]);
    });

    socket.on("newChat", (newChat: AdminChat) => {
      chatsRef.current.push(newChat);
      setChats([...chatsRef.current]);
    });

    socket.on("newMessage", (message: any) => {
      const chatIndex = chatsRef.current.findIndex((chat) => chat.id === message.chatId);
      if (chatIndex !== -1) {
        chatsRef.current[chatIndex].lastMessage = message;
        setChats([...chatsRef.current]);
      }
    });

    return () => {
      socket.off("userChats");
      socket.off("newChat");
      socket.off("newMessage");
    };
  }, [socket, user]);

  return (
    <>
      {window.innerWidth < 768 ? (
        <div className="flex flex-row w-full h-[90vh] justify-center">
          {selectedChatId === undefined && user && socket && (
            <div className="py-6 items-center justify-center">
              <ChatList
                user={user}
                chats={chats}
                selectedChatId={selectedChatId}
                setSelectedChatId={setSelectedChatId}
                socket={socket as Socket}
              />
            </div>
          )}
          {selectedChatId !== undefined && (
            <div className="flex-grow p-6 overflow-hidden">{children}</div>
          )}
        </div>
      ) : (
        <div className="flex flex-row w-full h-[90vh] p-6">
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
      )}
    </>
  );
}
