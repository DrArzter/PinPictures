"use client";
import React, { useContext } from "react";

import Notification from "./components/Notifications";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";


import { useUserContext } from "./contexts/userContext";

export default function Home() {
    const { user } = useUserContext();

    return (
        <div
            style={{
                backgroundImage: user?.uiBgPicPath ? `url(${user.uiBgPicPath})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "white",
            }}
            className="items-center justify-center min-h-screen"
        >
            <Header />
            <Notification />
            <Main />
            <Footer />
        </div>
    );
}
