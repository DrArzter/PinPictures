"use client";

import { SlMagnifier } from "react-icons/sl";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  const handleSearch = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    searchTerm: string
  ) => {
    if (!searchTerm) return;

    setSearchTerm("");
  };

  const searchBarClassName = `flex items-center flex-grow max-w-xl mx-4 rounded-full border-2 shadow-sm`;

  const searchInputClassName = `w-full rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lightModeText dark:text-darkModeText`;

  const searchIconContainerClassName = `p-2  rounded-full cursor-pointer text-lightModeText hover-transform`;

  return (
    <div className={searchBarClassName}>
      <input
        className={searchInputClassName}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Search..."
      />
      <div
        className={searchIconContainerClassName}
        onClick={(e) => handleSearch(e, searchTerm)}
      >
        <SlMagnifier className="text-lightModeText dark:text-darkModeText" size={24} />
      </div>
    </div>
  );
}
