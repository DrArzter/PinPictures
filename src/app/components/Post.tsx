import React, { useContext, useEffect } from "react";
import { FiLayers } from "react-icons/fi";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import ThemeContext from "@/app/contexts/ThemeContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import * as api from "@/app/api";

export default function Post({ post, windowHeight, windowId, user, ...props }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { openWindowByPath } = useWindowContext();
  const { addNotification } = useNotificationContext();
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post._count.likes);

  // Определяем высоту поста
  const postHeight = windowHeight * 0.4;

  // Классы для контейнера поста
  const postContainerClassName = `hover:scale-105 border rounded-xl focus:scale-105 transition-transform duration-300 overflow-hidden ${
    isDarkMode
      ? "border-gray-700 bg-gray-800 text-white"
      : "border-gray-300 bg-white text-gray-900"
  }`;

  // Устанавливаем состояние лайка только если пользователь авторизован
  useEffect(() => {
    if (
      user &&
      post.likes &&
      post.likes.some((like) => like.userId === user.id)
    ) {
      setIsLiked(true);
    }
  }, [post.likes, user]);

  const handleClick = (e) => {
    e.preventDefault();
    openWindowByPath(`/post/${post.id}`);
  };

  const handleChildClick = (e) => {
    e.stopPropagation();
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (!user) {
      addNotification({
        type: "error",
        message: "You must be logged in to like posts.",
      });
      return;
    }

    try {
      const response = await api.likePost(post.id);
      if (response.status === "success") {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState);
        setLikeCount((prevCount) => prevCount + (newLikeState ? 1 : -1));
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Условные классы и переменные для UI
  const imageContainerClassName = "w-full flex-1 overflow-hidden relative";
  const layersIconClassName = "absolute top-2 right-2 text-2xl text-yellow-500";
  const postContentClassName = "p-4 flex flex-row items-center justify-between";
  const postDescriptionClassName = "text-sm overflow-hidden line-clamp-3";
  const hasMultipleImages = post.images && post.images.length > 1;
  const postActionsClassName = "flex flex-row items-center space-x-4 mt-2";
  const likeButtonClassName =
    "flex items-center space-x-1 hover:text-yellow-500";
  const commentButtonClassName =
    "flex items-center space-x-1 hover:text-yellow-500";

  return (
    <div
      key={post.id}
      className={postContainerClassName}
      style={{ height: `${postHeight}px` }}
      onClick={handleClick}
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

        <div
          className={`${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          } h-[1px] w-full`}
        />

        <div className={postContentClassName} onClick={handleChildClick}>
          <p className={postDescriptionClassName}>{post.description}</p>
          <div className={postActionsClassName}>
            <button className={likeButtonClassName} onClick={handleLikeClick}>
              {isLiked ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
              <span>{likeCount}</span>
            </button>
            <div className={commentButtonClassName} onClick={handleChildClick}>
              <BsChatDots size={20} />
              <span>{post._count.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
