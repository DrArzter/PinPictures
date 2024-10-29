"use client";

import React, { useEffect, useRef, useState } from "react";

import { FaGear } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";

import { useUserContext } from "@/app/contexts/userContext";
import { useWindowContext } from "@/app/contexts/WindowContext";

import Link from "next/link";

import * as api from "@/app/api";

export default function DropdownMenu({ isDropdownOpen, toggleDropdown }) {
  const { user, setUser } = useUserContext();
  const { openWindowByPath } = useWindowContext();
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      toggleDropdown();
    }
  };  

  useEffect(() => {
    const handleKeyDown = (event) => {
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

  const dropdownClassName = `absolute h-[30vh] w-[20vw] z-[999] bottom-[6vh] left-1 rounded-md shadow-lg transform transition-all duration-300 ease-in-out 
    ${isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"} bg-white`;

  const menuItemsClassName = `flex flex-col gap-4 p-4 h-[calc(100%-10vh)] transition-colors text-black`;

  const iconClassName = "text-black";

  const handleLogout = () => {
    api.logout(setUser);
    toggleDropdown();
  };

  return (
    <>
      <div ref={dropdownRef} className={dropdownClassName}>
        <Link href={`/profile/${user.name}`}>
          <img
            src={user.avatar}
            alt="Profile"
            className="w-full h-[10vh] object-cover rounded-t-md hover:scale-105 cursor-pointer transition duration-300"
          />
        </Link>

        <div className={menuItemsClassName}>
          <div className="flex items-center gap-2 w-full justify-center">
            <FaGear className={iconClassName} onClick={() => openWindowByPath("/settings")} />
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
    </>
  );
}
