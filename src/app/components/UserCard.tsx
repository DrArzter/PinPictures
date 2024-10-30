import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useUserContext } from "@/app/contexts/userContext";
import LoadingIndicator from "./LoadingIndicator";
import DropdownMenu from "./DropdownMenu";

export default function UserCard() {
    const { user, userLoading } = useUserContext();

    const backgroundColor = user && user.settings?.bgColor ? `rgba(${user.settings.bgColor})` : 'rgba(0,0,0,0.3)';

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

    if (userLoading) {
        return (
            <div
                style={{
                    backgroundColor: backgroundColor
                }}
                className=" w-48 justify-center flex-row backdrop-blur-md bg-opacity-30 border-2 rounded-lg shadow-2xl cursor-pointer items-center">
                <LoadingIndicator />
            </div>
        )
    }
    return (
        <>
            <div
                style={{
                    backgroundColor: backgroundColor
                }}
                onClick={toggleDropdown}
                className="absolute left-1 bottom-2 p-2 backdrop-blur-xl bg-opacity-30 border-2 rounded-lg shadow-2xl cursor-pointer items-center flex flex-row gap-2">
                {user ? (
                    <><img
                        src={user.avatar}
                        alt="Profile"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                        className="w-10 h-10 rounded-full cursor-pointer hover-transform" />
                        <p className="font-bold">{user.name}</p>
                    </>
                ) : (
                    <RxAvatar className="w-10 h-10 rounded-full cursor-pointer hover-transform" />
                )}
            </div>
            {isDropdownOpen && (
                <DropdownMenu isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
            )}
        </>
    )
}
