// src/app/components/chat/ChatList.tsx

"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Chat } from "@/app/types/global";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import SearchBar from "../common/SearchBar";
import ModalsContext from "@/app/contexts/ModalsContext";
import { Socket } from "socket.io-client";

interface ChatListProps {
  user: User;
  chats: Chat[];
  selectedChatId: string | undefined;
  setSelectedChatId: (id: string) => void;
  socket: Socket | undefined;
}

export default function ChatList({
  chats,
  user,
  selectedChatId,
  setSelectedChatId,
  socket,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useContext(ModalsContext);
  const router = useRouter();

  const filteredChats = Array.isArray(chats)
    ? chats.filter((chat: Chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleChatClick = (chat: Chat) => {
    setSelectedChatId(chat.id);

    if (chat.ChatType === "private") {
      const otherUser = chat.users.find((u) => u.id !== user.id);
      if (otherUser) {
        router.push(`/chats/${otherUser.id}`);
      } else {
        router.push(`/chats/${chat.id}`);
      }
    } else {
      router.push(`/chats/${chat.id}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          onClick={() => openModal("CREATE_CHAT")}
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Start New Chat"
        >
          <AiOutlinePlus size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat: Chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors ${
                selectedChatId === chat.id ? "border-l-4 border-yellow-500" : ""
              }`}
            >
              <div className="flex-shrink-0">
                {chat.avatar ? (
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={chat.avatar}
                    alt={chat.name}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl">
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="ml-4 flex-1 flex flex-col justify-center">
                <span className="text-lg font-semibold">{chat.name}</span>
                <span className="text-sm">
                  {chat.lastMessage
                    ? `${chat.lastMessage.User.name}: ${chat.lastMessage.message}`
                    : "No messages"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <AiOutlineSearch className="text-4xl mb-2" />
            <p>No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}
