import React, { useContext } from "react";
import { FiLayers } from "react-icons/fi";
import ThemeContext from "@/app/contexts/ThemeContext";

export default function Post({ post, windowHeight }) {
  const { isDarkMode } = useContext(ThemeContext);

  // Calculate dynamic post height
  const postHeight = windowHeight * 0.3; // Example: 25% of windowHeight

  const postContainerClassName = `hover:scale-105 border-2 rounded-xl focus:scale-105 transition-transform duration-300
    ${isDarkMode ? "border-darkModeSecondaryBackground" : "border-lightModeSecondaryBackground"}`;

  const imageContainerClassName = "w-full h-full overflow-hidden rounded-lg";

  const layersIconClassName = "absolute top-4 right-4 text-3xl transition-colors text-yellow-500 duration-300";

  const postDescriptionClassName = "text-[16px] line-clamp-3 break-words";

  const postAuthorClassName = "text-[16px] mt-[11px]";

  const hasMultipleImages = post.images && post.images.length > 1;

  return (
    <div key={post.id} className={postContainerClassName} style={{ height: `${postHeight}px` }}>
      <div className="flex flex-col h-full">
        <div className="w-full h-full relative">
          {post.images && (
            <>
              <div className={imageContainerClassName}>
                {hasMultipleImages && <FiLayers className={layersIconClassName} />}
                <img
                  src={post.images[0].picpath}
                  alt={post.name}
                  className="w-full h-full object-cover" // Ensures image fills container without overflow
                />
              </div>
              <div className="mt-[5px] p-[5px]">
                <p className="text-[16px]">{post.name}</p>
                <p className={postDescriptionClassName}>{post.description}</p>
                <p className={postAuthorClassName}>{post.author}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
