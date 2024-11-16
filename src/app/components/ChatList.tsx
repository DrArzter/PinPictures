import React, { useState } from "react";
import { User, Chat } from "@/app/types/global";
import { AiOutlineSearch } from "react-icons/ai";

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
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <AiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat: Chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${
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
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xl text-gray-300">
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Текстовая часть */}
              {wideWindow && (
                <div className="ml-4 flex-1 flex flex-col justify-center">
                  <span className="text-lg font-semibold text-white">
                    {chat.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {chat.lastMessage
                      ? `${chat.lastMessage.author.name}: ${chat.lastMessage.message}`
                      : "Нет сообщений"}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-10">
            <AiOutlineSearch className="text-4xl mb-2" />
            <p>Чатов не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
