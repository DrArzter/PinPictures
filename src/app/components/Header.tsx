"use client";

import { useRouter } from 'next/navigation';

import SearchBar from './SearchBar';
import UserCard from './UserCard';
import DropdownMenu from "./DropdownMenu";

import { Logo } from "../resources/Logo";

import { useState } from 'react';

export default function Header() {
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const [user, setUser] = useState({});

    const headerClassName = "header py-3 shadow-lg mx-auto items-center flex flex-row justify-between w-3/4 transition-colors duration-300";
    const searchBarContainerClassName = "flex-1 flex justify-center";

    return (
        <header className={headerClassName}>

            {/* Контейнер с SearchBar в центре */}
            <div className={searchBarContainerClassName}>
                <SearchBar />
            </div>

            {/* UserCard сдвинут ещё правее */}
            <div className="flex items-center" onClick={toggleDropdown}>
                <UserCard />
            </div>

            {/* DropdownMenu справа */}
            {isDropdownOpen && (
                <DropdownMenu isDropdownOpen={isDropdownOpen} user={user} setUser={setUser} toggleDropdown={toggleDropdown} />
            )}


        </header>
    );
}
