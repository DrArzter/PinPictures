import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import DropdownMenu from "./DropdownMenu";
import { useUserContext } from "@/app/contexts/userContext";

import { useState } from "react";

export default function Header() {
  const { user } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const headerClassName =
    "header fixed top-0 left-0 right-0 py-3 mt-4 shadow-lg mx-auto items-center flex flex-row justify-between w-3/4 transition-colors duration-300 border-2 border-gray-300 rounded-lg z-[100000]";
  const searchBarContainerClassName = "flex-1 flex justify-center";

  return (
    <header
    style={{ 
      backgroundColor: `rgba(${user?.settings.bgColor})`
     }}
     className={headerClassName}>
      {/* Контейнер с SearchBar в центре */}
      <div className={searchBarContainerClassName}>
        <SearchBar />
      </div>

      {/* UserCard сдвинут ещё правее */}
      <div className="px-2" onClick={toggleDropdown}>
        <UserCard />
        {/* DropdownMenu справа */}
        {isDropdownOpen && (
          <DropdownMenu
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
          />
        )}
      </div>
    </header>
  );
}
