// ./src/app/profile/[name]/page.tsx
"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { useUserContext } from "@/app/contexts/UserContext";

import LoadingIndicator from "@/app/components/common/LoadingIndicator";

import * as api from "@/app/api";
import PostList from "@/app/components/post/PostList";

import { Post as PostType, ProfileData } from "@/app/types/global";

import { motion } from "framer-motion";
import {
  AiOutlineMessage,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useColumnCount } from "@/app/hooks/useColumnCount";

export default function Profile() {
  const params = useParams();
  const router = useRouter();
  const addNotification = useNotificationContext().addNotification;
  const profileName = useMemo(
    () => (params.name ? params.name : null),
    [params.name]
  );
  const { user } = useUserContext();
  const [profile, setProfile] = useState<ProfileData>();
  const isMyProfile = useMemo(
    () => profileName === user?.name,
    [profileName, user]
  );

  const isFriend = useMemo(
    () => profile?.friends?.some((friend) => friend.friend.id === user?.id),
    [profile, user]
  );

  const isPending = useMemo(
    () =>
      profile?.friends?.some(
        (friend) => friend.friend.id === user?.id && friend.status === "pending"
      ),
    [profile, user]
  );

  const [loading, setLoading] = useState<boolean>(true);

  const columns = useColumnCount({ minColumnWidth: 300, maxColumns: 4 });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileName || typeof profileName !== "string") return;

      try {
        setLoading(true);
        const response = await api.getProfile(profileName);
        setProfile(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    if (profileName) {
      fetchProfile();
    }
  }, [profileName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[85vh] md:h-[90vh]">
        <LoadingIndicator />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[85vh] md:h-[90vh]">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  const handleAddFriendClick = async () => {
    try {
      api.addFriend(profile.id, profile.name).then(() => {});
    } catch {}
  };

  const handleDeleteFriendClick = async () => {
    addNotification({
      message: "This feature is not implemented yet",
      status: "info",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="relative" variants={itemVariants}>
        <div className="w-full h-[30vh]">
          <Image
            src={profile.background || "/default-background.jpg"}
            alt={`${profile.name} Background`}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%" }}
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          className="absolute top-1/2 left-0 w-full h-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-32 h-32 rounded-full border-4 border-white">
            <Image
              src={profile.avatar || "/default-avatar.png"}
              alt={`${profile.name} Avatar`}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-40 px-4 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        <div className="text-center relative">
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          {isMyProfile ? (
            <p className="text-sm mt-2">That is your profile</p>
          ) : (
            <div className="flex justify-center space-x-4 mt-2">
              <AiOutlineMessage
                className="cursor-pointer"
                onClick={() => router.push(`/chats/${profile.id}`)}
                size={24}
                aria-label="Send Message"
              />
              {isFriend && !isPending ? (
                <AiOutlineUserDelete
                  className="cursor-pointer"
                  onClick={handleDeleteFriendClick}
                  size={24}
                  aria-label="Delete Friend"
                />
              ) : (
                <AiOutlineUserAdd
                  className="cursor-pointer"
                  onClick={handleAddFriendClick}
                  size={24}
                  aria-label="Add Friend"
                />
              )}
            </div>
          )}
        </div>

        <motion.div className="mt-6 max-w-2xl mx-auto" variants={itemVariants}>
          <p className="text-center">
            {profile.description || `We know nothing about ${profile.name}.`}
          </p>
        </motion.div>

        <motion.div className="mt-10" variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4">Friends</h2>
          {profile.friends && profile.friends.length > 0 ? (
            <motion.div
              className="flex space-x-4 overflow-x-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {profile.friends.map((friendObj, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-24 text-center"
                  variants={itemVariants}
                >
                  <img
                    src={friendObj.friend.avatar || "/default-avatar.png"}
                    alt={friendObj.friend.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                  <p className="mt-2 text-sm">{friendObj.friend.name}</p>
                  <p className="text-xs capitalize text-gray-600">
                    {friendObj.status === "pending"
                      ? "Pending"
                      : friendObj.status}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="">{profile?.name} does not have any friends.</p>
          )}
        </motion.div>

        <motion.div className="mt-10" variants={itemVariants}>
          {profile.Post && profile.Post.length > 0 ? (
            <PostList
              posts={profile.Post as unknown as PostType[]}
              columns={columns}
            />
          ) : (
            <p className="">{profile?.name} does not have any posts.</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
