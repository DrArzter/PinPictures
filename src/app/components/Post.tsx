import React, { useContext } from "react";
import { FiLayers } from "react-icons/fi";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import ThemeContext from "@/app/contexts/ThemeContext";

export default function Post({ post, windowHeight }) {
  const { isDarkMode } = useContext(ThemeContext);

  const postHeight = windowHeight * 0.4;

  const postContainerClassName = `hover:scale-105 border rounded-xl focus:scale-105 transition-transform duration-300 overflow-hidden ${
    isDarkMode
      ? "border-gray-700 bg-gray-800 text-white"
      : "border-gray-300 bg-white text-gray-900"
  }`;

  const imageContainerClassName = "w-full flex-1 overflow-hidden relative";

  const layersIconClassName = "absolute top-2 right-2 text-2xl text-yellow-500";

  const postContentClassName = "p-4 flex flex-row items-center justify-between";

  const postDescriptionClassName = "text-sm overflow-hidden line-clamp-3";

  const hasMultipleImages = post.images && post.images.length > 1;

  const postActionsClassName = "flex flex-row items-center space-x-4 mt-2";
  const likeButtonClassName = "flex items-center space-x-1 hover:text-yellow-500";
  const commentButtonClassName = "flex items-center space-x-1 hover:text-yellow-500";

  return (
    <div
      key={post.id}
      className={postContainerClassName}
      style={{ height: `${postHeight}px` }}
    >
      <div className="flex flex-col h-full">
        {post.images && (
          <div className={imageContainerClassName}>
            {hasMultipleImages && <FiLayers className={layersIconClassName} />}
            <img
              src={post.images[0].picpath}
              alt={post.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
              <p className="text-lg font-semibold text-white">{post.name}</p>
              <div className="flex items-center">
                <p className="mr-2 text-white">{post.author.name}</p>
                <img
                  src={post.author.avatar}
                  className="w-10 h-10 rounded-full"
                  alt={post.author.name}
                />
              </div>
            </div>
          </div>
        )}

        <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-300"} h-[1px] w-full`} />

        <div className={postContentClassName}>
          <p className={postDescriptionClassName}>{post.description}</p>
          <div className={postActionsClassName}>
            <button className={likeButtonClassName}>
              <BsHeart size={20} />
              <span>{ 0 }</span>
            </button>
            <div className={commentButtonClassName}>
              <BsChatDots size={20} />
              <span>{ 0 }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
