"use client";

import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { useUserContext } from "@/app/contexts/UserContext";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";
import Chat from "@/app/components/chat/Chat";
import { FullChat } from "@/app/types/global";
import { useParams } from "next/navigation";

export default function GroupChatPage() {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const { chatId } = useParams() as { chatId: string };
  const [chat, setChat] = useState<FullChat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("getChat", Number(chatId));

    socket.on("chat", (chatData: FullChat) => {
      setChat(chatData);
      setIsLoading(false);
    });

    return () => {
      socket.off("chat");
    };
  }, [socket, chatId, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Chat
      user={user!}
      chat={chat}
      isActiveChatLoading={false}
      socket={socket}
    />
  );
}
