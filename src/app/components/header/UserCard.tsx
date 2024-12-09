// ./src/app/components/UserCard.tsx
"use client";

import React, { useContext } from "react";
import { RiLoginBoxLine } from "react-icons/ri";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useUserContext } from "@/app/contexts/UserContext";
import MenuContext from "@/app/contexts/MenuContext";

export default function UserCard() {
  const { user } = useUserContext();
  const router = useRouter();
  const { menuType, openMenu, closeMenu } = useContext(MenuContext);

  const toggleDropdown = () => {
    if (!user) {
      //Тут что-то было
    } else {
      if (menuType === "DROPDOWN_MENU") {
        closeMenu();
      } else {
        openMenu("DROPDOWN_MENU");
      }
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
          <RiLoginBoxLine
            title="Profile"
            onClick={(e) => {
              e.preventDefault();
              router.push("/authentication");
            }}
            className="w-10 h-10 rounded-full cursor-pointer hover-transform"
          />
        )}
      </div>
    </div>
  );
}
