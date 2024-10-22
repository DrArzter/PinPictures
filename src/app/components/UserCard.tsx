import React, { useEffect } from "react";
import { RxAvatar } from "react-icons/rx";
import { useUserContext } from "@/app/contexts/userContext";
import LoadingIndicator from "./LoadingIndicator";

import config from "@/app/api/config";

export default function UserCard() {
    const { user, userLoading } = useUserContext();

    const backgroundColor = user && user.settings?.bgColor ? `rgba(${user.settings.bgColor})` : 'rgba(0,0,0,0.3)';

    if (userLoading) {
        return(
         <div 
         style={{ 
           backgroundColor: backgroundColor
          }}
          className="p-2 w-48 justify-center flex-row backdrop-blur-md bg-opacity-30 border-2 rounded-lg shadow-2xl rounded-md cursor-pointer items-center">
            <LoadingIndicator />
        </div>
        )
    }

    return (
        <div 
        style={{ 
          backgroundColor: backgroundColor
         }}
         className="flex w-48 justify-center flex-row p-2 gap-4 backdrop-blur-md bg-opacity-30 border-2 rounded-lg shadow-2xl rounded-md cursor-pointer items-center">
            {user? (
                <><img
                    src={user.picpath.startsWith("https://ui-avatars.com/")
                        ? user.picpath
                        : config.apiUrl.replace("/api", "/") + user.picpath}
                    alt="Profile"
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                    className="w-10 h-10 rounded-full cursor-pointer hover-transform" /><p className="font-bold">{user.name}</p></>
            ) : (
                <RxAvatar className="w-10 h-10 rounded-full cursor-pointer hover-transform" />
            )}
            
        </div>
    )
}
