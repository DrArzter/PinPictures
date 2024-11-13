import React from "react";
import { User } from "@/app/types/global";

interface ChatListProps {
  user: User;
  chat: any;
}

export default function ChatList({ user, chat }: ChatListProps) {
  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-500 rounded-xl px-2 py-1">
          Choose a chat to start a conversation
        </div>
      </div>
    );
  }

  return <div></div>;
}
