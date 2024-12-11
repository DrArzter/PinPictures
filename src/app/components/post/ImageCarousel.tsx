"use client";
import React from "react";
import Image from "next/image";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

interface ImageCarouselProps {
  images: { picpath: string }[];
  currentIndex: number;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onImageClick?: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentIndex,
  onPrev,
  onNext,
  onImageClick,
}) => {
  const hasMultipleImages = images.length > 1;

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-lg">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={images[currentIndex].picpath}
          alt={`Image ${currentIndex}`}
          width={0}
          height={0}
          sizes="100vw"
          className="cursor-pointer w-full h-full object-cover"
          onClick={onImageClick}
        />
      </div>
      {hasMultipleImages && (
        <>
          <button
            onClick={onPrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-full p-2 focus:outline-none hover:bg-opacity-75 transition"
            aria-label="Previous Image"
          >
            <AiOutlineLeft size={24} />
          </button>
          <button
            onClick={onNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-full p-2 focus:outline-none hover:bg-opacity-75 transition"
            aria-label="Next Image"
          >
            <AiOutlineRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
