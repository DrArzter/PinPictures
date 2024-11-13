"use client";

import React, { useEffect, useRef } from "react";
import { FaGear } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";

import { useUserContext } from "@/app/contexts/UserContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import * as api from "@/app/api";
import { User } from "@/app/types/global"; // Предполагаем, что User определен в global.d.ts

interface DropdownMenuProps {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

export default function DropdownMenu({ isDropdownOpen, toggleDropdown }: DropdownMenuProps) {
  const { user, setUser } = useUserContext() as { user: User | null; setUser: React.Dispatch<React.SetStateAction<User | null>> };
  const { openWindowByPath } = useWindowContext() as { openWindowByPath: (path: string) => void };
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      (event.target as HTMLElement).id !== "user-card"
    ) {
      toggleDropdown();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen, toggleDropdown]);

  const dropdownClassName = `absolute w-[10vw] z-[999] bottom-20 left-1 rounded-md shadow-lg transform transition-all duration-300 ease-in-out 
    ${isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"} bg-white`;

  const menuItemsClassName = `flex flex-col gap-4 p-4 h-[calc(100%-10vh)] transition-colors text-black`;
  const iconClassName = "text-black";

  const handleLogout = () => {
    toggleDropdown();
    api.logout(setUser);
  };

  return (
    <div ref={dropdownRef} className={dropdownClassName}>
      <img
        src={user?.avatar}
        alt="Profile"
        onClick={() => openWindowByPath(`/profile/${user?.name}`)}
        className="w-full h-[10vh] object-cover rounded-t-md hover:scale-105 cursor-pointer transition duration-300"
      />

      <div className={menuItemsClassName}>
        <div className="flex items-center gap-2 w-full justify-center">
          <FaGear
            className={iconClassName}
            onClick={() => openWindowByPath("/settings")}
          />
          <span>Settings</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300 w-full justify-center">
          <CiBookmarkPlus className={iconClassName} />
          <span>Bookmark</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300 w-full justify-center"
          onClick={handleLogout}
        >
          <RiLogoutBoxFill className={iconClassName} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
