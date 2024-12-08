"use client";
import * as api from "@/app/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaRegComments,
  FaThumbsUp,
  FaRegEnvelope,
} from "react-icons/fa";
import { MdPostAdd, MdChatBubbleOutline } from "react-icons/md";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";

export default function AdminSummary() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [stats, setStats] = useState({
    users: {
      title: "Users",
      value: "1200",
      icon: <FaUsers />,
      color: "text-blue-500",
      link: "/admin/users",
    },
    posts: {
      title: "Posts",
      value: "540",
      icon: <MdPostAdd />,
      color: "text-green-500",
      link: "/admin/posts",
    },
    comments: {
      title: "Comments",
      value: "2450",
      icon: <FaRegComments />,
      color: "text-purple-500",
      link: "/admin/comments",
    },
    likes: {
      title: "Likes",
      value: "7800",
      icon: <FaThumbsUp />,
      color: "text-pink-500",
    },
    messages: {
      title: "Messages",
      value: "11200",
      icon: <FaRegEnvelope />,
      color: "text-red-500",
    },
    chats: {
      title: "Chats",
      value: "85",
      icon: <MdChatBubbleOutline />,
      color: "text-indigo-500",
    },
    newUsers: {
      title: "New users",
      value: "WIP",
      icon: <FaUsers />,
      color: "text-blue-500",
    },
    newPosts: {
      title: "New posts",
      value: "WIP",
      icon: <MdPostAdd />,
      color: "text-green-500",
    },
    newComments: {
      title: "New comments",
      value: "WIP",
      icon: <FaRegComments />,
      color: "text-purple-500",
    },
  });

  useEffect(() => {
    api
      .getSummary()
      .then((data) => {
        data = data.data;
        setStats((prevStats) => ({
          ...prevStats,
          users: { ...prevStats.users, value: data.usersCount },
          posts: { ...prevStats.posts, value: data.postsCount },
          comments: { ...prevStats.comments, value: data.commentsCount },
          likes: { ...prevStats.likes, value: data.likesCount },
          messages: { ...prevStats.messages, value: data.messagesCount },
          chats: { ...prevStats.chats, value: data.chatsCount },
          newUsers: { ...prevStats.newUsers, value: data.newUsersCount },
          newPosts: { ...prevStats.newPosts, value: data.newPostsCount },
          newComments: {
            ...prevStats.newComments,
            value: data.newCommentsCount,
          },
        }));
      })
      .catch((error) => {
        console.error("Failed to fetch summary:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[85vh] md:h-[90vh]">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Статистика сайта</h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {Object.values(stats).map((stat, index) => (
          <motion.div
            key={index}
            className={`bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:bg-gray-700 ${stat.link ? "cursor-pointer" : ""}`}
            onClick={() => stat.link && router.push(stat.link) as any}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <h2 className="text-xl font-bold">{stat.title}</h2>
              <p className="text-gray-400 text-lg">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}