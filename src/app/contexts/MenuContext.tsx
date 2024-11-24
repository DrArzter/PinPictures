// ./src/app/contexts/MenuContext.tsx
"use client";
import React, { createContext, useState, ReactNode } from "react";

type MenuType = "DROPDOWN_MENU" | "RIGHT_HAND_MENU" | null;

interface MenuProps {
  [key: string]: any;
}

interface MenuContextType {
  menuType: MenuType;
  menuProps: MenuProps;
  openMenu: (type: MenuType, props?: MenuProps) => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType>({
  menuType: null,
  menuProps: {},
  openMenu: () => {},
  closeMenu: () => {},
});

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [menuType, setMenuType] = useState<MenuType>(null);
  const [menuProps, setMenuProps] = useState<MenuProps>({});

  const openMenu = (type: MenuType, props: MenuProps = {}) => {
    setMenuProps(props);
    setMenuType((prevMenuType) => {
      if (prevMenuType !== type) {
        return type;
      }
      return prevMenuType;
    });
  };

  const closeMenu = () => {
    setMenuType(null);
    setMenuProps({});
  };

  return (
    <MenuContext.Provider value={{ menuType, menuProps, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
