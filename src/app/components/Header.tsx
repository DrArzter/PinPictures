import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import DropdownMenu from "./DropdownMenu";
import { useUserContext } from "@/app/contexts/UserContext";
import { useNotificationContext } from "../contexts/NotificationContext";

import { useState } from "react";

export default function Header() {
  const { user } = useUserContext();
  const { addNotification } = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    "absolute top-0 backdrop-blur-xl left-0 right-0 py-2 mt-2 shadow-lg mx-auto items-center flex flex-row justify-between w-5/6 border-2 rounded-lg z-[999]";

  const searchBarContainerClassName = "justify-center";

  const backgroundColor =
    user && user.settings?.bgColor
      ? `rgba(${user.settings.bgColor})`
      : "rgba(255,255,255,0.3)";

  return (
    <header
      style={{
        backgroundColor: backgroundColor,
      }}
      className={headerClassName}
    >
      <div className={searchBarContainerClassName}>
        <SearchBar />
      </div>

      <div className="px-2" onClick={toggleDropdown}>
        <UserCard />
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
