// src/app/components/chat/ChatList.tsx

"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientSelfUser, AdminChat } from "@/app/types/global";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import SearchBar from "../common/SearchBar";
import ModalsContext from "@/app/contexts/ModalsContext";
import { Socket } from "socket.io-client";
import ChatListItem from "./ChatListItem";

interface ChatListProps {
  user: ClientSelfUser;
  chats: AdminChat[];
  selectedChatId: string | undefined;
  setSelectedChatId: (id: string) => void;
  socket: Socket | undefined;
}

export default function ChatList({
  chats,
  user,
  selectedChatId,
  setSelectedChatId,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { openModal } = useContext(ModalsContext);
  const router = useRouter();

  const filteredChats = Array.isArray(chats)
    ? chats.filter((chat: AdminChat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const handleChatClick = (chat: AdminChat) => {
    setSelectedChatId(chat.id.toString());

    if (chat.ChatType === "private") {
      const otherUser = chat.UsersInChats.find(
        (u: { id: number }) => u.id !== user.id
      );
      if (otherUser) {
        router.push(`/chats/${otherUser.id}`);
      }
    } else {
      router.push(`/chats/group/${chat.id}`);
    }
  };

  return (
    <div className="flex flex-col h-full w-full md:w-auto">
      <div className="flex items-center justify-between mb-4">
        <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
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
          filteredChats.map((chat: AdminChat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              selectedChatId={selectedChatId}
              handleChatClick={handleChatClick}
            />
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
