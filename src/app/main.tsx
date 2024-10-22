"use client";
import React from "react";

import Notification from "./components/Notifications";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

import { useUserContext } from "./contexts/userContext";

export default function Home() {
    const { user } = useUserContext();

    const backgroundImage = user && user.settings?.uiBgPicPath 
        ? `url(${user.settings.uiBgPicPath})` 
        : "url(/images/background.jpeg)";

    return (
        <div
            style={{
                backgroundImage: backgroundImage,
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
