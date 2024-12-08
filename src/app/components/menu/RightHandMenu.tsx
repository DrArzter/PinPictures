// ./src/app/components/menus/RightHandMenu.tsx
"use client";

import React, { useEffect, useRef, useContext, useState } from "react";
import IconList from "../common/IconList";

import { useRouter } from "next/navigation";

import { FaBell } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLoginBoxFill } from "react-icons/ri";
import { SlMagnifier } from "react-icons/sl";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { LogoIcon } from "../../resources/LogoIcon";
import ModalsContext from "@/app/contexts/ModalsContext";

interface RightHandMenuProps {
  closeMenu: () => void;
}

export default function RightHandMenu({ closeMenu }: RightHandMenuProps) {
  const { user } = useUserContext();
  const { addNotification } = useNotificationContext();
  const router = useRouter();
  const { openModal } = useContext(ModalsContext);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideBarRef.current &&
      !sideBarRef.current.contains(event.target as Node) &&
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

  const handleNotificationClick = () => {
    addNotification({
      message: `WIP`,
      status: "info",
      time: 5000,
      clickable: true,
      link_to: "/authentication",
      soundRequired: true,
      sound: "https://meowpad.pw/cdn/meowpad/sounds/2363e8c0-trenbolon.mp3",
    });
  };

  const orientation = "col";
  const iconList = [
    {
      name: "Posts",
      icon: (
        <BsFillFileEarmarkPostFill
          title="Posts"
          onClick={() => {
            router.push("/posts");
          }}
        />
      ),
    },
    {
      name: "Bell",
      icon: <FaBell title="Notifications" onClick={handleNotificationClick} />,
    },
    user && {
      name: "Add",
      icon: (
        <CiSquarePlus
          title="Create Post"
          onClick={() => {
            openModal("CREATE_POST");
            handleClose();
          }}
        />
      ),
    },
    {
      name: "Message",
      icon: (
        <AiOutlineMessage
          onClick={() => {
            router.push("/chats");
          }}
        />
      ),
    },
    !user && {
      name: "Authentication",
      icon: (
        <RiLoginBoxFill
          title="Login"
          onClick={() => router.push("/authentication")}
        />
      ),
    },
    {
      name: "Search",
      icon: <SlMagnifier title="Search"
      onClick={() => router.push("/search")} />,
    },
  ].filter((icon): icon is { name: string; icon: JSX.Element } =>
    Boolean(icon)
  );

  const sidebarClassName = `fixed z-[999] top-0 pt-4 right-0 h-full dark:bg-darkModeSecondaryBackground bg-lightModeSecondaryBackground shadow-lg transform transition-transform duration-300 ease-in-out ${
    isVisible ? "translate-x-0" : "translate-x-full"
  }`;

  return (
    <div ref={sideBarRef} className={sidebarClassName}>
      <div className="p-4 flex justify-between items-center dark:fill-white fill-black">
        <LogoIcon />
      </div>
      <div className="p-4">
        <IconList iconList={iconList} orientation={orientation} size={36} />
      </div>
    </div>
  );
}
