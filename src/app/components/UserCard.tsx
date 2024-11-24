"use client";

import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineMenu } from "react-icons/ai";

import { useUserContext } from "@/app/contexts/UserContext";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import DropdownMenu from "./DropdownMenu";
import RightHandMenu from "./RightHandMenu";

export default function UserCard() {
  const { user, userLoading } = useUserContext();
  const { addNotification } = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDropdown = () => {
    if (!user) {
      addNotification({
        message: `Please login first`,
        status: "info",
        time: 5000,
        clickable: true,
        link_to: "/authentication",
      });
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex items-center gap-8">
        <div
          id="user-card"
          className="p-2 border-2 rounded-lg items-center flex flex-row gap-2 cursor-pointer hover-transform"
          onClick={toggleDropdown}
        >
          {user ? (
            <>
              <img
                src={user.avatar}
                alt="Profile"
                loading="lazy"
                style={{ objectFit: "cover" }}
                id="user-card"
                className="w-10 h-10 rounded-full cursor-pointer hover-transform"
              />
              <p className="font-bold" id="user-card">
                {user.name}
              </p>
            </>
          ) : (
            <RxAvatar className="w-10 h-10 rounded-full cursor-pointer hover-transform" />
          )}
        </div>
        <AiOutlineMenu
          className="w-10 h-10 rounded-full cursor-pointer hover-transform"
          onClick={toggleSidebar}
        />
      </div>
      <DropdownMenu isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
      <RightHandMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}
