import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaRegClock, FaHeart } from "react-icons/fa";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { getProfile } from "@/app/api";

import { User } from "@/app/types/global";

interface ProfileProps {
  dynamicProps: User;
  windowWidth: number;
  windowHeight: number;
}

export default function Profile({ dynamicProps, windowWidth, windowHeight }: ProfileProps) {
  const { name } = dynamicProps;
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (userProfile) return;

    getProfile(name)
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [name, userProfile]);

  if (!userProfile) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${userProfile?.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        height: `${windowHeight - 55}px`,
        width: `${windowWidth - 5}px`,
      }}
      className="relative flex items-center justify-center rounded-lg"
    >
      {/* Semi-transparent layer for background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-lg rounded-lg"></div>

      <motion.div
        className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-2xl p-8 mx-auto"
        style={{ width: `${windowWidth * 0.8}px` }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center">
          <motion.img
            src={userProfile?.avatar}
            alt={`${userProfile?.name}'s avatar`}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            whileHover={{ scale: 1.05 }}
          />
          <motion.h1
            className="text-3xl font-bold text-white mt-4"
            whileHover={{ textShadow: "0px 0px 10px rgba(255,255,255,0.8)" }}
          >
            {userProfile?.name}
          </motion.h1>
          <div className="text-white flex items-center mt-3 space-x-3">
            <FaEnvelope className="text-lg" />
            <span>{userProfile?.email}</span>
          </div>
          <div className="text-white flex items-center mt-2 space-x-3">
            <FaRegClock className="text-lg" />
            <span>
              Last login: {new Date(userProfile?.lastLoginAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-inner p-4 max-h-60 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Recent Posts
          </h2>
          {userProfile?.posts.length > 0 ? (
            <ul className="space-y-3 pl-3 pr-2">
              {userProfile.posts.map((post) => (
                <motion.li
                  key={post.id}
                  className="p-4 bg-gray-100 rounded-lg flex justify-between items-start shadow-sm"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                  }}
                >
                  <div>
                    <h3 className="text-lg text-gray-800 font-semibold">
                      {post.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{post.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Created at: {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center text-pink-500">
                    <FaHeart className="mr-1" />
                    <span>{post.likesCount}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No recent posts.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
