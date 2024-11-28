// src/app/components/Chats.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";

import ChatList from "@/app/components/chat/ChatList";
import Chat from "@/app/components/chat/Chat";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";
import { useUserContext } from "../contexts/UserContext";

export default function Chats() {
  const { socket } = useSocketContext();

  const { user } = useUserContext();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );
  const [activeChat, setActiveChat] = useState<FullChat | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isActiveChatLoading, setIsActiveChatLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Fetch the list of chats
  useEffect(() => {
    if (socket) {
      socket.emit("getChats");

      socket.on("chatsList", (data: Chat[]) => {
        console.log("Received chats data:", data);
        setChats(data);
        setLoading(false);
      });

      return () => {
        socket.off("chatsList");
      };
    }
  }, [socket]);

  // Listen for new chats created
  useEffect(() => {
    if (socket) {
      socket.on("newChatCreated", (newChat: Chat) => {
        console.log("New chat created:", newChat);
        setChats((prevChats) => [...prevChats, newChat]);
      });

      return () => {
        socket.off("newChatCreated");
      };
    }
  }, [socket]);

  // Fetch the full details of the selected chat
  useEffect(() => {
    if (selectedChatId && socket) {
      setIsActiveChatLoading(true);
      socket.emit("getChat", selectedChatId);

      socket.on("chat", (data: FullChat) => {
        console.log("Received chat data:", data);
        setActiveChat(data);
        setIsActiveChatLoading(false);
      });

      return () => {
        socket.off("chat");
      };
    }
  }, [selectedChatId, socket]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center scrollbar-hidden h-[85vh] md:h-[90vh] w-full">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center scrollbar-hidden p-4 h-[85vh] md:h-[90vh] w-full">
      <div className="flex flex-row w-full h-full gap-2 border p-2 rounded-2xl shadow-xl">
        <div className="rounded-2xl p-2">
          <ChatList
            chats={chats}
            user={user}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            socket={socket}
            windowWidth={windowWidth}
          />
        </div>
        <div className="p-2 rounded-2xl w-full">
          <Chat
            user={user}
            chat={activeChat}
            isActiveChatLoading={isActiveChatLoading}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
}
