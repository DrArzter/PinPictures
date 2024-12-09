"use client";
import React, { useContext } from "react";
import { RxDoubleArrowLeft } from "react-icons/rx";
import MenuContext from "@/app/contexts/MenuContext";

export default function SideBarButton() {
  const { openMenu } = useContext(MenuContext);

  const toggleSidebar = () => {
    openMenu("RIGHT_HAND_MENU");
  };

  return (
    <RxDoubleArrowLeft
      title="Sidebar"
      className="w-10 h-10 rounded-full cursor-pointer hover-transform"
      onMouseEnter={toggleSidebar}
      onClick={toggleSidebar}
    />
  );
}
