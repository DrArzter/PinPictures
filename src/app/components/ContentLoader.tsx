"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/app/contexts/UserContext";
import Home from "@/app/home";
import LoadingIndicator from "./LoadingIndicator";

import Artoria from "@/app/resources/Artoria";

export default function ContentLoader() {
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");
  const { user, userLoading } = useUserContext() as any;

  const placeholderSVG = `data:image/svg+xml;base64,${btoa(Artoria())}`;

  useEffect(() => {
    const loadImage = (imgSrc: any) => {
      const img = new Image();
      img.src = imgSrc;

      img.onload = () => {
        setBgImage(imgSrc);
        setLoading(false);
      };

      img.onerror = () => {
        console.error("Error loading image:", imgSrc);
        setBgImage(
          "https://storage.yandexcloud.net/pinpictures/otherImages/background2.jpeg"
        );
        setLoading(false);
      };
    };

    let imgSrc =
      "https://storage.yandexcloud.net/pinpictures/otherImages/background2.jpeg";
    if (user && user.uiBackground) {
      imgSrc = user.uiBackground;
    }

    if (!userLoading) {
      loadImage(imgSrc);
    }
  }, [user?.uiBackground, userLoading]);

  const backgroundStyle = {
    backgroundImage: bgImage ? `url(${bgImage})` : `url("${placeholderSVG}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    transition: "opacity 0.5s ease-in-out",
  };

  if (userLoading || loading) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <Home />
    </div>
  );
}
