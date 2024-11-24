// ./src/app/components/RightHandMenu.tsx
"use client";

import React, { useEffect, useRef, useContext } from "react";
import IconList from "./IconList";

import { FaBell } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLoginBoxFill } from "react-icons/ri";
import { SlMagnifier } from "react-icons/sl";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { User, Notification } from "@/app/types/global";
import Logo from "./Logo";
import { LogoIcon } from "../resources/LogoIcon";
import ModalsContext from "@/app/contexts/ModalsContext"; // Импортируем ModalsContext

interface RightHandMenuProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function RightHandMenu({
  isSidebarOpen,
  toggleSidebar,
}: RightHandMenuProps) {
  const { user } = useUserContext();
  const { addNotification } = useNotificationContext();
  const { openModal } = useContext(ModalsContext); // Используем useContext для доступа к openModal
  const sideBarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideBarRef.current &&
      !sideBarRef.current.contains(event.target as Node) &&
      (event.target as HTMLElement).id !== "user-card"
    ) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen, toggleSidebar]);

  const handleNotificationClick = () => {
    addNotification({
      message: `Please login first`,
      status: "info",
      time: 5000,
      clickable: true,
      link_to: "/authentication",
    });
  };

  const orientation = "col";
  const iconList = [
    {
      name: "Post",
      icon: <BsFillFileEarmarkPostFill onClick={() => {}} />,
    },
    {
      name: "Bell",
      icon: <FaBell onClick={handleNotificationClick} />,
    },
    user && {
      name: "Add",
      icon: (
        <CiSquarePlus
          onClick={() => {
            openModal("CREATE_POST");
            toggleSidebar();
          }}
        />
      ),
    },
    {
      name: "Message",
      icon: <AiOutlineMessage onClick={() => {}} />,
    },
    !user && {
      name: "Authentication",
      icon: <RiLoginBoxFill onClick={() => {}} />,
    },
    {
      name: "Search",
      icon: <SlMagnifier onClick={() => {}} />,
    },
  ].filter(
    (icon): icon is { name: string; icon: JSX.Element } => Boolean(icon)
  );

  return (
    <div
      ref={sideBarRef}
      className={`fixed z-[999] top-0 pt-4 right-0 h-full dark:bg-darkModeSecondaryBackground bg-lightModeSecondaryBackground shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 flex justify-between items-center dark:fill-white fill-black">
        <LogoIcon />
      </div>
      <div className="p-4">
        <IconList iconList={iconList} orientation={orientation} size={36} />
      </div>
    </div>
  );
}
