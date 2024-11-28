// src/app/components/chat/NewChatModal.tsx

"use client";

import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { useUserContext } from "@/app/contexts/UserContext";
import { useSocketContext } from "@/app/contexts/SocketContext";


const NewChatModal = ({ onClose }: { onClose: () => void }) => {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [chatName, setChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFriendSelect = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreateChat = () => {
    if (selectedFriends.length === 0) {
      alert("Please select at least one friend.");
      return;
    }

    if (selectedFriends.length > 1 && !chatName.trim()) {
      alert("Please enter a group chat name.");
      return;
    }

    setLoading(true);

    // Prepare data for socket emission
    const participantIds = selectedFriends;
    const isGroupChat = participantIds.length > 1;

    if (socket) {
      if (isGroupChat && avatarFile) {
        // Convert avatar to base64
        const reader = new FileReader();
        reader.readAsDataURL(avatarFile);
        reader.onloadend = () => {
          const avatarBase64 = reader.result as string;
          emitCreateChat(participantIds, isGroupChat, avatarBase64);
        };
      } else {
        emitCreateChat(participantIds, isGroupChat, null);
      }
    }
  };

  const emitCreateChat = (
    participantIds: number[],
    isGroupChat: boolean,
    avatarBase64: string | null
  ) => {
    socket.emit("createChat", {
      participantIds,
      chatName: isGroupChat ? chatName : null,
      avatar: isGroupChat ? avatarBase64 : null,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-lightModeBackground dark:bg-darkModeBackground rounded-3xl p-6 relative w-11/12 max-w-3xl overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute z-[999] top-4 right-4 text-darkModeText hover:text-darkModeSecondaryText"
          aria-label="Close Modal"
        >
          <MdClose size={34} />
        </button>
        <motion.h1
          className="text-4xl font-extrabold text-center mb-8 text-darkModeText"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Start New Chat
        </motion.h1>
        <div className="flex flex-col gap-6">
          {/* Friends Selection */}
          <div>
            <label className="block text-lg font-medium mb-2 text-darkModeText">
              Select Friends
            </label>
            <div className="max-h-60 overflow-y-auto scrollbar-hidden">
              {user.friends.map((friendObj) => (
                <label
                  key={friendObj.friend.id}
                  className="flex items-center mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friendObj.friend.id)}
                    onChange={() => handleFriendSelect(friendObj.friend.id)}
                    className="mr-2"
                  />
                  <span>{friendObj.friend.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group Chat Name and Avatar */}
          {selectedFriends.length > 1 && (
            <>
              <div>
                <label className="block text-lg font-medium mb-2 text-darkModeText">
                  Group Chat Name
                </label>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="Enter group chat name..."
                  className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-darkModeText">
                  Group Chat Avatar (optional)
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatarInput"
                  />
                  <label
                    htmlFor="avatarInput"
                    className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    Choose Avatar
                  </label>
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full ml-4 object-cover"
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Create Chat Button */}
          <button
            onClick={handleCreateChat}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-semibold transition-colors duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            }`}
          >
            {loading ? "Creating Chat..." : "Create Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
