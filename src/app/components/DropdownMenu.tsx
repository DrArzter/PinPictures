"use client";

import React, { useEffect, useRef } from "react";
import { FaGear } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";
import Link from "next/link";

export default function DropdownMenu({ isDropdownOpen, user, toggleDropdown }) {
  const dropdownRef = useRef(null);

  // Закрытие по клику вне меню
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      toggleDropdown();
    }
  };

  // Закрытие по нажатию "Escape"
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

  // Упрощенный класс без темной темы
  const dropdownClassName = `absolute z-[999] right-0 top-16 lg:w-[10vw] w-32 rounded-md shadow-lg transform transition-all duration-300 ease-in-out 
    ${isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"} bg-white`;

  const menuItemsClassName = `p-4 flex flex-col gap-4 w-full text-black transition-colors`;

  const iconClassName = "text-black";

  // Пример заглушки для выхода
  const handleLogout = () => {
    console.log("Logout clicked");
    toggleDropdown(); // Закрываем меню после выхода
  };

  return (
    <div ref={dropdownRef} className={dropdownClassName}>
      <Link href={`/profile/${user.name}`}>
        <img
          src={
            user.picpath.startsWith("https://ui-avatars.com/")
              ? user.picpath
              : `${config.apiUrl.replace("/api", "/")}${user.picpath}`
          }
          alt="Profile"
          className="w-full h-24 object-cover rounded-t-md hover:scale-105 cursor-pointer transition duration-300"
        />
      </Link>

      <div className={menuItemsClassName}>
        {/* Упрощаем, убираем ChangeTheme */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/Settings" className="cursor-pointer hover:scale-105 transition duration-300">
            <FaGear className={iconClassName} />
          </Link>
        </div>

        {/* Закладка */}
        <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300">
          <CiBookmarkPlus className={iconClassName} />
          <span>Bookmark</span>
        </div>

        {/* Logout */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300"
          onClick={handleLogout}
        >
          <RiLogoutBoxFill className={iconClassName} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
