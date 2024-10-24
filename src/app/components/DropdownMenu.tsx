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
  const { user, setUser, userLoading, setUserLoading } = useUserContext();
  const { openWindowByPath } = useWindowContext();
  const [showVideo, setShowVideo] = useState(0);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (false && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const dropdownClassName = `absolute z-[999] w-[10vw] bottom-[6vh] left-1 rounded-md shadow-lg transform transition-all duration-300 ease-in-out 
    ${isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"} bg-white`;

  const menuItemsClassName = `p-4 flex flex-col gap-4 w-full text-black transition-colors`;

  const iconClassName = "text-black";

  const handleLogout = () => {
    api.logout(setUser);
    toggleDropdown();
  };

  const handleDvoechkuVEblet = () => {
    setShowVideo(1);
  };

  useEffect(() => {

    if (showVideo === 1) {
      return (
        <div>
          {showVideo && (
            <div style={{ marginTop: '20px' }}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/kNEfmCgL4e4?autoplay=1&mute=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      );
    } else if (showVideo === 2) {
      return (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-100">
        </div>
      );
    }
  }, [showVideo]);

  return (
    <div ref={dropdownRef} className={dropdownClassName}>
      <Link href={`/profile/${user.name}`}>
        <img
          src={user.avatar}
          alt="Profile"
          className="w-full h-24 object-cover rounded-t-md hover:scale-105 cursor-pointer transition duration-300"
        />
      </Link>

      <div className={menuItemsClassName}>

        <div className="flex items-center justify-between gap-4">
          <FaGear className={iconClassName}
            onClick={() => { openWindowByPath("/settings"); }} />
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300">
          <CiBookmarkPlus className={iconClassName} />
          <span>Bookmark</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300"
          onClick={handleLogout}
        >
          <RiLogoutBoxFill className={iconClassName} />
          <span>Logout</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300"
          onClick={handleDvoechkuVEblet}
        >
          <RiLogoutBoxFill className={iconClassName} />
          <span>ShutDown</span>
        </div>
      </div>
    </div>
  );
}
