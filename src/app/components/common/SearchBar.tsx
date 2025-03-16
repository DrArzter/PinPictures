"use client";

import { SlMagnifier } from "react-icons/sl";

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {

  const searchBarClassName = `flex items-center flex-grow w-full mx-4 rounded-full border-2 shadow-sm`;

  const searchInputClassName = `w-full rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lightModeText dark:text-darkModeText`;


  return (
    <div className={searchBarClassName}>
      <input
        className={searchInputClassName}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="search"
        placeholder="Search..."
        aria-label="Search"
      />
    </div>
  );
}
