// ./src/app/components/menus/DropdownMenu.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { useUserContext } from "@/app/contexts/UserContext";
import * as api from "@/app/api";
import { clientSelfUser } from "@/app/types/global";

interface DropdownMenuProps {
  closeMenu: () => void;
}

{
  /* TODO: Add gay sex */
}

export default function DropdownMenu({ closeMenu }: DropdownMenuProps) {
  const { user, setUser } = useUserContext() as {
    user: clientSelfUser | null;
    setUser: React.Dispatch<React.SetStateAction<clientSelfUser | null>>;
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      (event.target as HTMLElement).id !== "user-card"
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    setIsVisible(true);

    document.addEventListener("mousedown", handleClickOutside);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeMenu();
    }, 300);
  };

  const dropdownClassName = `absolute top-24 right-4 z-[999] md:right-72 w-56 rounded-md shadow-lg transform transition-all duration-300 ease-in-out 
        ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"} 
        dark:bg-darkModeBackground bg-lightModeBackground`;

  const menuItemsClassName = `flex flex-col gap-4 p-4 h-[calc(100%-10vh)] transition-colors 
        dark:darkModeText light:lightModeText`;

  const iconClassName = "text-current";

  const handleLogout = () => {
    handleClose();
    api.logout(setUser);
  };

  return (
    <div ref={dropdownRef} className={dropdownClassName}>
      <div>
        {user && (
          <div>
            <Image
              src={user.avatar}
              alt="Profile"
              onClick={() => router.push("/profile/" + user?.name)}
              className="w-full h-[10vh] object-cover rounded-t-md hover:scale-105 cursor-pointer transition duration-300"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>

      <div className={menuItemsClassName}>
        <div
          className="flex items-center gap-2 w-full justify-center cursor-pointer"
          onClick={(e) => router.push("settings")}
        >
          <FaGear className={iconClassName} />
          <span>Settings</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer w-full justify-center"
          onClick={() => console.log("Bookmark")}
        >
          <CiBookmarkPlus className={iconClassName} />
          <span>Bookmark</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer w-full justify-center"
          onClick={handleLogout}
        >
          <RiLogoutBoxFill className={iconClassName} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
