// app/components/Header.tsx

import React from "react";
import Logo from "./Logo";
import SearchBar from "@/app/components/common/SearchBar";
import UserCard from "./UserCard";
import ChangeTheme from "./ChangeTheme";

const Header: React.FC = () => {
  return (
    <header className="shadow-xl w-full flex items-center justify-center py-4">
      <div className="flex items-center justify-between w-5/6">
        <div className="hidden md:flex items-center gap-6">
          <Logo />
          <SearchBar />
        </div>
        <div className="flex items-center gap-6">
          <UserCard />
          <ChangeTheme />
        </div>
      </div>
    </header>
  );
};

export default Header;
