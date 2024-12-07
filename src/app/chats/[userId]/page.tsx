// ./app/chats/[userId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { useUserContext } from "@/app/contexts/UserContext";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";
import Chat from "@/app/components/chat/Chat";
import { FullChat } from "@/app/types/global";
import { useParams } from "next/navigation";

export default function PrivateChatPage() {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const { userId } = useParams() as { userId: string };
  const [chat, setChat] = useState<FullChat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

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
      otherUserId={Number(userId)} // Передаём otherUserId для создания чата при первом сообщении
    />
  );
}
