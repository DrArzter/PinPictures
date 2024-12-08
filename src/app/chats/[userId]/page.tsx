// ./app/chats/[userId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { useUserContext } from "@/app/contexts/UserContext";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";
import Chat from "@/app/components/chat/Chat";
import { FullChat } from "@/app/types/global";
import { useParams, useRouter } from "next/navigation";

export default function PrivateChatPage() {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  const [chat, setChat] = useState<FullChat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!socket || !user) return;

    const otherUserId = Number(userId);

    if (otherUserId === user.id) {
      setIsLoading(false);
      setChat(undefined);
      return;
    }

    socket.emit("getOrCreatePrivateChat", otherUserId);

    socket.on("chat", (chatData: FullChat) => {
      if (chatData && !chatData.error) {
        setChat(chatData);
        socket.emit("getUserChats");
      }
      setIsLoading(false);
    });

    socket.on("newChat", (newChatData: FullChat) => {
      if (newChatData.UsersInChats.some(uic => uic.userId === user.id)) {
        setChat(newChatData);
      }
    });

    return () => {
      socket.off("chat");
      socket.off("newChat");
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
      socket={socket}
      otherUserId={Number(userId)} // для создания чата при первом сообщении
    />
  );
}
