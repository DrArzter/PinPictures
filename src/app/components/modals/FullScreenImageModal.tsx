"use client";
import React, { useEffect } from "react";
import Image from "next/image";

interface FullScreenImageProps {
  imageUrl: string;
  onClose: () => void;
}

export default function FullScreenImage({
  imageUrl,
  onClose,
}: FullScreenImageProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleClick = () => {
    onClose();
  };

  return (
    <div
      id="FullScreenImage"
      onClick={handleClick}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50"
    >
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <Image
          src={imageUrl}
          alt="Image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto object-contain rounded-2xl"
        />
      </div>
    </div>
  );
}
