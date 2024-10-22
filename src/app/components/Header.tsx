import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import DropdownMenu from "./DropdownMenu";
import { useUserContext } from "@/app/contexts/userContext";
import { useNotificationContext } from "../contexts/NotificationContext";

import { useState } from "react";

export default function Header() {
  const { user } = useUserContext();
  const { addNotification } = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!user) {
      addNotification({
        message: `Сначала авторизуйтесь`,
        status: "info",
        time: 5000,
        clickable: true,
        link_to: "/authentication",
      });
    }
  };

  //TODO: Отцентровать SearchBar и сделать его responsive

  const headerClassName =
    "header absolute top-0 backdrop-blur-xl left-0 right-0 py-3 mt-4 shadow-lg mx-auto items-center flex flex-row justify-between w-3/4 transition-colors duration-300 border-2 border-gray-300 rounded-lg z-[100000]";
  
    const searchBarContainerClassName = "justify-center";

    const backgroundColor = user && user.settings?.bgColor ? `rgba(${user.settings.bgColor})` : 'rgba(255,255,255,0.3)';

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
        {isDropdownOpen && user && (
          <DropdownMenu
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
          />
        )}
      </div>
    </header>
  );
}
