"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface FullScreenImageProps {
  imageUrl: string;
  onClose: () => void;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  imageUrl,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handlePopState = () => {
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    // Добавляем в историю новый элемент, чтобы отловить действие "назад"
    window.history.pushState(null, "", window.location.href);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onClose]);

  const handleClick = () => {
    onClose();
  };

  return (
    <div
      id="FullScreenImage"
      onClick={handleClick}
      className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-opacity-80 bg-black"
    >
      <Image
        src={imageUrl}
        onClick={(e) => e.stopPropagation()}
        alt="Image"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "90vh", height: "90vh" }}
        className="w-full h-auto object-contain rounded-2xl cursor-pointer"
      />
    </div>
  );
};

export default FullScreenImage;
