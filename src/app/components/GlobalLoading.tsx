"use client";

import React, { useState, useEffect } from "react";
import { useLoadingContext } from "../contexts/LoadingContext";
import { useUserContext } from "../contexts/UserContext";
import LoadingIndicator from "./common/LoadingIndicator";
import Artoria from "../resources/Artoria";
import { User } from "../types/global";

export default function GlobalLoading({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
