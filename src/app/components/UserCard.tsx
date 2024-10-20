import React from "react";

import { RxAvatar } from "react-icons/rx";


export default function UserCard() {
    return (
        <div className="flex flex-row p-2 gap-4 backdrop-blur-md bg-white bg-opacity-30 border-2 rounded-lg shadow-2xl rounded-md cursor-pointer">
            <div>
                <RxAvatar size={24} />
            </div>
            <div>
                <p className="text-lightModeText font-bold">User Name</p>
            </div>
        </div>
    )
}