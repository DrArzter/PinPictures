import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import DropdownMenu from "./DropdownMenu";
import { useUserContext } from "@/app/contexts/userContext";

import { useState } from "react";

export default function Header() {
  const { user } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  //TODO: Отцентровать SearchBar и сделать его responsive

  const headerClassName =
    "header fixed top-0 backdrop-blur-xl left-0 right-0 py-3 mt-4 shadow-lg mx-auto items-center flex flex-row justify-between w-3/4 transition-colors duration-300 border-2 border-gray-300 rounded-lg z-[100000]";
  
    const searchBarContainerClassName = "ustify-center";

    const backgroundColor = user && user.settings?.bgColor ? `rgba(${user.settings.bgColor})` : 'rgba(0,0,0,0.3)';

  return (
    <header
    style={{ 
      backgroundColor: backgroundColor,
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
