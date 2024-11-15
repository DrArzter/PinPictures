// src/app/components/Chats.tsx

import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { User } from "@/app/types/global";

import ChatList from "@/app/components/ChatList";
import Chat from "@/app/components/Chat";
import LoadingIndicator from "@/app/components/LoadingIndicator";

interface ChatsProps {
  windowHeight: number;
  windowWidth: number;
  windowId: number;
  user: User;
}

export default function Chats({
  windowHeight,
  windowWidth,
  windowId,
  user,
}: ChatsProps) {
  const { socket } = useSocketContext();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [activeChat, setActiveChat] = useState<FullChat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isActiveChatLoading, setIsActiveChatLoading] = useState(false);

  // Fetch the list of chats
  useEffect(() => {
    if (socket) {
      socket.emit("getChats");

      socket.on("chatsList", (data: Chat[]) => {
        console.log("Received chats data:", data);
        setChats(data);
        setIsLoading(false);
      });

      return () => {
        socket.off("chatsList");
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

  if (isLoading) {
    return (
      <div
        style={{ height: `${windowHeight - 55}px`, width: `${windowWidth}px` }}
        className="flex flex-col items-center justify-center scrollbar-hidden p-4"
      >
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div
      style={{ height: `${windowHeight - 55}px`, width: `${windowWidth}px` }}
      className="flex flex-col items-center justify-center scrollbar-hidden p-4"
    >
      <div className="flex flex-row w-full h-full gap-2">
        <div
          style={{ width: `${(windowWidth / 12) * 3}px` }}
          className="rounded-2xl bg-gray-800 p-2"
        >
          <ChatList
            chats={chats}
            user={user}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId} // Updated prop
          />
        </div>
        <div
          style={{ width: `${(windowWidth / 12) * 9}px` }}
          className="p-2 rounded-2xl bg-gray-800 "
        >
          <Chat
            user={user}
            chat={activeChat}
            isActiveChatLoading={isActiveChatLoading}
          />
        </div>
      </div>
    </div>
  );
}
