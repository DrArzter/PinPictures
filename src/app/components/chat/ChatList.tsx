import React, { useState } from "react";
import { User, Chat } from "@/app/types/global";
import { AiOutlineSearch } from "react-icons/ai";
import SearchBar from "../common/SearchBar";

interface ChatListProps {
  user: User;
  chats: Chat[];
  selectedChatId: number;
  setSelectedChatId: (id: string) => void;
  windowWidth: number;
}

export default function ChatList({
  chats,
  user,
  selectedChatId,
  setSelectedChatId,
  windowWidth,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const wideWindow = windowWidth > 768;

  // Фильтрация чатов по запросу
  const filteredChats = Array.isArray(chats)
    ? chats.filter((chat: Chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleChatClick = (chat: Chat) => {
    setSelectedChatId(chat.id);
  };

  return (
    <div className="flex scrollbar-hidden flex-col h-full border-r border-r pr-4">
      <div className="relative mb-4 w-full border-b pb-5">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
              {/* Обертка для аватара */}
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
                <span className="text-lg font-semibold">
                  {chat.name}
                </span>
                <span className="text-sm">
                  {chat.lastMessage
                    ? `${chat.lastMessage.author.name}: ${chat.lastMessage.message}`
                    : "Нет сообщений"}
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
