// src/app/components/Chat.tsx

import React from "react";
import { User } from "@/app/types/global";
import LoadingIndicator from "./LoadingIndicator";

interface ChatProps {
  user: User;
  chat: FullChat | undefined;
  isActiveChatLoading: boolean;
}

export default function Chat({ user, chat, isActiveChatLoading }: ChatProps) {
  if (isActiveChatLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-500 rounded-xl px-2 py-1">
          Choose a chat to start a conversation
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-gray-500 rounded-xl px-2 py-1">
        {chat.name}
      </div>
    </div>
  );
}
