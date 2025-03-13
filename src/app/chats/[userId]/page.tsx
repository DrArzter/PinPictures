// ./app/chats/[userId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { useUserContext } from "@/app/contexts/UserContext";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";
import Chat from "@/app/components/chat/Chat";
import { FullChat } from "@/app/types/global";
import { useParams } from "next/navigation";
import { useSelectedChatStore } from "@/app/useSelectedChatStore";

export default function PrivateChatPage() {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const { selectedChatId, setSelectedChatId } = useSelectedChatStore();
  const { userId } = useParams() as { userId: string };
  const [chat, setChat] = useState<FullChat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log(setSelectedChatId);
  console.log(selectedChatId);

  useEffect(() => {
    if (!socket || !user) return;

    const otherUserId = Number(userId);

    if (otherUserId === user.id) {
      setIsLoading(false);
      setChat(undefined);
      return;
    }

    let didRequestChat = false;

    const handleChat = (chatData: FullChat) => {
      if (chatData) {
        setChat(chatData);
        socket.emit("getUserChats");
      }
      setIsLoading(false);
    };

    if (!didRequestChat) {
      socket.emit("getOrCreatePrivateChat", otherUserId);
      didRequestChat = true;
    }

    socket.on("chat", handleChat);

    return () => {
      socket.off("chat", handleChat);
    };
  }, [socket, user, userId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <span>Cannot open a chat with yourself or chat not found.</span>
      </div>
    );
  }

  return (
    <Chat
      user={user!}
      chat={chat}
      isActiveChatLoading={false}
      socket={socket || undefined}
      otherUserId={Number(userId)}
      setSelectedChatId={setSelectedChatId}
    />
  );
}
