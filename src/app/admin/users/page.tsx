"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as api from "@/app/api";
import {
  FaUserShield,
  FaBan,
  FaCrown,
  FaUserNinja,
  FaTimes,
} from "react-icons/fa";
import { useRef } from "react";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const audioRef = useRef(null);

  // Открытие модального окна
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    if (searchTerm.length >= 1) {
      api.getAUsers(searchTerm).then((data) => {
        setUsers(data.data);
      });
    }
  }, [searchTerm]);


  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  
  const toggleBan = () => {
    playSound();
    api.banUser(selectedUser.id).then((data) => {
      setSelectedUser(data.data);
    })
  };

  const changebananaLevel = (level) => {
    setSelectedUser((prev) => ({ ...prev, bananaLevel: level }));
  };

  return (
    <div className="container mx-auto py-10 text-gray-100">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        🎉 User Galaxy 🌌
      </h1>

      {/* Поле поиска */}
      <motion.input
        type="text"
        placeholder="🔍 Search by name, email, or ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-3 w-full border rounded-md shadow-sm mb-6"
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      />

      {/* Список пользователей */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div
            key={user.id}
            className="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:bg-gray-700"
            whileHover={{ scale: 1.025, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => handleUserClick(user)}
          >
            <FaUserNinja size={40} className="text-yellow-400" />
            <h2 className="text-lg font-semibold">{user.name}</h2>
          </motion.div>
        ))}
      </div>

      {/* Модальное окно */}
      {selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-lg relative"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <div className="flex justify-between items-center">
              <h2
                className="text-xl font-bold mb-4 cursor-pointer"
                onClick={() => router.push(`/profile/${selectedUser.name}`)}
              >
                {selectedUser.name} 🌟
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-2xl text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mb-4">📧 {selectedUser.email}</p>

            {/* Ban/Unban Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              onClick={toggleBan}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedUser.banned
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {selectedUser.banned ? <FaBan /> : <FaCrown />}
              {selectedUser.banned ? "Unban" : "Ban"}
            </motion.button>
            <audio ref={audioRef} src="https://storage.yandexcloud.net/pinpictures/sounds/banned.mp3" preload="auto" />

            {/* Admin Level Selector */}
            <div className="flex flex-col items-center mt-6 space-y-4">
              <span className="text-lg font-medium">
                🧙‍♂️ Admin Power Level: {selectedUser.bananaLevel}
              </span>
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9, rotate: -5 }}
                    onClick={() => changebananaLevel(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedUser.bananaLevel === level
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {level === 3 ? <FaCrown /> : level}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="text-center mt-6"
            >
              <p>🔥 Super Admins have access to the 🔥 Sacred Knowledge 🔥</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
