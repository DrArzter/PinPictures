// ./src/app/components/UserCard.tsx
"use client";

import React, { useContext } from "react";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineMenu } from "react-icons/ai";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useUserContext } from "@/app/contexts/UserContext";
import MenuContext from "@/app/contexts/MenuContext";
import { useNotificationContext } from "@/app/contexts/NotificationContext";

export default function UserCard() {
  const { user } = useUserContext();
  const router = useRouter();
  const { menuType, openMenu, closeMenu } = useContext(MenuContext);
  const { addNotification } = useNotificationContext();

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
      if (menuType === "DROPDOWN_MENU") {
        closeMenu();
      } else {
        openMenu("DROPDOWN_MENU");
      }
    }
  };

  const toggleSidebar = () => {
    if (menuType === "RIGHT_HAND_MENU") {
      closeMenu();
    } else {
      openMenu("RIGHT_HAND_MENU");
    }
  };

  return (
    <div className="flex items-center gap-8">
      <div
        id="user-card"
        className="p-2 border-2 rounded-lg items-center flex flex-row gap-2 cursor-pointer hover-transform"
        onClick={toggleDropdown}
      >
        {user ? (
          <>
            <div className="w-12 h-12 rounded-full cursor-pointer hover-transform">
              <Image
                src={user.avatar}
                alt={user.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full rounded-full"
              />
            </div>
            <p className="font-bold" id="user-card">
              {user.name}
            </p>
          </>
        ) : (
          <RxAvatar
            title="Profile"
            onClick={router.push("/authentication")}
            className="w-10 h-10 rounded-full cursor-pointer hover-transform"
          />
        )}
      </div>
      <AiOutlineMenu
        title="Sidebar"
        className="w-10 h-10 rounded-full cursor-pointer hover-transform"
        onClick={toggleSidebar}
      />
    </div>
  );
}
