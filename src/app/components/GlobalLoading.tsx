"use client";

import React, { useState, useEffect } from "react";
import { useLoadingContext } from "../contexts/LoadingContext";
import { useUserContext } from "../contexts/UserContext";
import LoadingIndicator from "./common/LoadingIndicator";
import Artoria from "../resources/Artoria";
import { User } from "../types/global";
import { LuBanana } from "react-icons/lu";
import { motion } from "framer-motion";
import { useRef } from "react";


export default function GlobalLoading({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bgImage, setBgImage] = useState<string>("");

  const { isLoading } = useLoadingContext();
  const { user, userLoading } = useUserContext() as {
    user: User | null;
    userLoading: boolean;
  };

  const placeholderSVG = `data:image/svg+xml;base64,${btoa(Artoria())}`;
  const defaultBgImage =
    "https://storage.yandexcloud.net/pinpictures/otherImages/background2.jpeg";

    const playSound = () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    };

  useEffect(() => {
    const loadImage = (imgSrc: string) => {
      const img = new Image();
      img.src = imgSrc;

      img.onload = () => {
        setBgImage(imgSrc);
        setLoading(false);
      };

      img.onerror = () => {
        console.error("Error loading image:", imgSrc);
        setBgImage(defaultBgImage);
        setLoading(false);
      };
    };

    let imgSrc = defaultBgImage;
    if (user?.uiBackground) {
      imgSrc = user.uiBackground;
    }

    if (!userLoading) {
      loadImage(imgSrc);
    }
  }, [user?.uiBackground, userLoading]);

  const backgroundStyle = {
    backgroundImage: `url(${bgImage || placeholderSVG})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    transition: "opacity 0.5s ease-in-out",
  };

  if (userLoading || isLoading || loading) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <div
          style={{
            ...backgroundStyle,
            filter: "blur(10px)",
            WebkitFilter: "blur(10px)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
        <div className="w-full h-full flex items-center justify-center">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (user?.banned) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black relative overflow-hidden" onClick={playSound}>
        {/* Дождь из бананов */}
        <div className="banana-rain">
          {Array.from({ length: 50 }).map((_, index) => (
            <LuBanana
              key={index}
              className="banana text-yellow-400 text-4xl"
              style={{
                '--x': Math.random(),
                '--delay': `${Math.random() * 2}s`,
                '--duration': `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        {/* Основной контент */}
        <span className="fixed text-white ml-4 text-xl font-bold">
          You have been bananed
        </span>
        <audio ref={audioRef} src="https://storage.yandexcloud.net/pinpictures/sounds/banned.mp3" preload="auto" />
      </div>
    );
  }
  
  

  return <>{children}</>;
}
