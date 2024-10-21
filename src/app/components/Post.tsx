import React, { useContext } from "react";
import { FiLayers } from "react-icons/fi";

import  ThemeContext  from "@/app/contexts/ThemeContext";

export default function Post({ post }) {

  const { isDarkMode } = useContext(ThemeContext);

  const postContainerClassName = `hover:scale-105 border-2 rounded-xl focus:scale-105 transition-transform duration-300 ${
    isDarkMode ? "border-darkModeSecondaryBackground" : "border-lightModeSecondaryBackground"
  }`;

  const imageContainerClassName = "w-full overflow-hidden rounded-lg";

  const layersIconClassName = "absolute top-4 right-4 text-3xl transition-colors text-yellow-500 duration-300";

  const postDescriptionClassName = "text-[16px] line-clamp-3 break-words";

  const postAuthorClassName = "text-[16px] mt-[11px]";

  const hasMultipleImages = post.images && post.images.length > 1;


  return (
    <div key={post.id} className={postContainerClassName}>
      <div className="flex flex-col md:flex-row">
        <div className="w-full group relative">
          {post.images && (
            <>
              <div className={imageContainerClassName}>
                {hasMultipleImages && <FiLayers className={layersIconClassName} />}
                  <img
                    src={post.images[0].picpath} 
                    alt={post.name}
                    className="w-full object-cover max-h-[512px]"
                  />
                <div className="mt-[5px] p-[5px]">
                  <p className="text-[16px]">{post.name}</p>
                  <p className={postDescriptionClassName}>{post.description}</p>
                  <p className={postAuthorClassName}>{post.author}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}