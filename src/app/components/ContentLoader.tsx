"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/app/contexts/userContext";

import Home from "@/app/home";
import LoadingIndicator from "./LoadingIndicator";

export default function ContentLoader() {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { user, userLoading } = useUserContext();

  useEffect(() => {
    const imageSrc = user && user.uiBackground ? user.uiBackground : "/images/background2.jpeg";
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setBackgroundLoaded(true);
      setTimeout(() => setShowContent(true), 500);
    };
  }, [user]);

  const backgroundStyle = {
    backgroundImage: backgroundLoaded
      ? `url(${user?.uiBackground || "/images/background2.jpeg"})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "white",
    opacity: showContent ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
    minHeight: "100vh",
  };

  const loadingBackgroundStyle = {
    backgroundImage: `url(/images/background2.jpeg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "blur(10px)",
    WebkitFilter: "blur(10px)",
    minHeight: "100vh",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  };

  if (userLoading || !backgroundLoaded) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div style={loadingBackgroundStyle} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      {showContent && <Home />}
    </div>
  );
}
