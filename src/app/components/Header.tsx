import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import DropdownMenu from "./DropdownMenu";

import { useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const headerClassName =
    "header py-3 shadow-lg mx-auto items-center flex flex-row justify-between w-3/4 transition-colors duration-300";
  const searchBarContainerClassName = "flex-1 flex justify-center";

  return (
    <header className={headerClassName}>
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
