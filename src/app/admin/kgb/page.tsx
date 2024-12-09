"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as api from "@/app/api";
import { AdminChat } from "@/app/types/global";

export default function Chats() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<AdminChat | null>(null);
  const [chats, setChats] = useState<Array<AdminChat>>([]);
  const router = useRouter();

  // Открытие модального окна
  const handleUserClick = (chat: AdminChat) => {
    setSelectedChat(chat);
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedChat(null);
  };

  useEffect(() => {
    if (searchTerm.length >= 1) {
      api.getAUserChats(searchTerm).then((data) => {
        setChats(data.data);
      });
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-10 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      {/* Поле поиска */}
      <input
        type="text"
        placeholder="Search by name, email, or ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-full border rounded-md shadow-sm mb-4"
      />

      {/* Список пользователей */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            className="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:bg-gray-700 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleUserClick(chat)}
          >
            <h2 className="text-lg font-semibold">
              {chat.chatType == "private" ? (
                <div className="flex flex-row gap-1">
                  <span className="text-red-500">
                    {chat.usersInChats[0].User.name}
                  </span> 
                  - 
                  <span className="text-red-500">
                    {chat.usersInChats[1].User.name}
                  </span>
                </div>
              ) : (
                chat.name
              )}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Модальное окно */}
      {selectedChat && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-lg"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
          >
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-bold mb-4 cursor-pointer">
              {selectedChat.chatType == "private" ? (
                <div className="flex flex-row gap-1">
                  <span className="text-red-500" onClick={() => router.push(`/profile/${selectedChat.usersInChats[0].User.name}`)}>
                    {selectedChat.usersInChats[0].User.name}
                  </span> 
                  - 
                  <span className="text-red-500" onClick={() => router.push(`/profile/${selectedChat.usersInChats[1].User.name}`)}>
                    {selectedChat.usersInChats[1].User.name}
                  </span>
                </div>
              ) : (
                selectedChat.name
              )}
              </h2>
              <button onClick={handleCloseModal} className="text-lg">
                &times;
              </button>
            </div>

            <h3 className="font-semibold mb-2">Messages:</h3>
            <ul className="list-disc list-inside">wip</ul>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
