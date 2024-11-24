// ./src/app/components/MenuManager.tsx
"use client";

import React, { useContext } from "react";
import MenuContext from "@/app/contexts/MenuContext";
import DropdownMenu from "./DropdownMenu";
import RightHandMenu from "./RightHandMenu";

const MenuManager: React.FC = () => {
  const { menuType, menuProps, closeMenu } = useContext(MenuContext);

  if (!menuType) return null;

  const handleClose = () => {
    closeMenu();
  };

  switch (menuType) {
    case "DROPDOWN_MENU":
      return <DropdownMenu {...menuProps} closeMenu={handleClose} />;
    case "RIGHT_HAND_MENU":
      return <RightHandMenu {...menuProps} closeMenu={handleClose} />;
    default:
      return null;
  }
};

export default MenuManager;
