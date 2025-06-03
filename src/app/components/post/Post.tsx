import React, { useState } from "react";
import { FiLayers } from "react-icons/fi";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import type { Post as PostType } from "@/app/types/global";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as api from "@/app/api";

const getBlurredImageUrl = (url: string) => {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}quality=10&width=50`;
};

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const { addNotification } = useNotificationContext();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(!!post.isLiked);
  const [likeCount, setLikeCount] = useState<number>(post._count.Likes);

  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/post/${post.id}`);
  };

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const originalLikedState = isLiked;
    const newLikeState = !isLiked;

    setIsLiked(newLikeState);
    setLikeCount((prevCount) => prevCount + (newLikeState ? 1 : -1));

    try {
      const response = await api.likePost(post.id);
      if (response.data.status !== "success") {
        setIsLiked(originalLikedState);
        setLikeCount((prevCount) => prevCount + (originalLikedState ? 1 : -1));
        addNotification({
          status: "error",
          message: "Failed to update like.",
        });
      }
    } catch {
      setIsLiked(originalLikedState);
      setLikeCount((prevCount) => prevCount + (originalLikedState ? 1 : -1));
      addNotification({
        status: "error",
        message: "Failed to update like.",
      });
    }
  };

  const postContainerClassName = `border rounded-xl transition-transform duration-300 overflow-hidden shadow-md hover:shadow-lg bg-white dark:bg-neutral-800 dark:border-neutral-700`; // Добавил фон и тени
  const imageContainerClassName =
    "w-full overflow-hidden relative bg-neutral-200 dark:bg-neutral-700";
  const layersIconClassName =
    "absolute bottom-2 right-2 text-xl text-white drop-shadow-md z-10";
  const postContentClassName = "p-3 flex flex-col";
  const postDescriptionClassName =
    "text-sm overflow-hidden line-clamp-2 mb-2 text-neutral-700 dark:text-neutral-300";
  const postActionsClassName =
    "flex flex-row items-center justify-end space-x-4 text-neutral-600 dark:text-neutral-400";
  const actionButtonClassName =
    "flex items-center space-x-1 hover:text-yellow-500 transition-colors";

  const hasMultipleImages = post.ImageInPost && post.ImageInPost.length > 1;
  const firstImage = post.ImageInPost?.[0];

  return (
    <div
      key={post.id}
      className={postContainerClassName}
      onClick={handlePostClick}
      role="article"
      aria-labelledby={`post-title-${post.id}`}
    >
      <div className="flex flex-col h-full">
        {firstImage && (
          <div className={`${imageContainerClassName} aspect-square`}>
            <Image
              src={firstImage.picpath}
              alt={post.name || "Post image"}
              title={post.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={getBlurredImageUrl(firstImage.picpath)}
              className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            />

            {hasMultipleImages && (
              <FiLayers
                title="Multiple images"
                className={layersIconClassName}
              />
            )}

            <div
              className="absolute top-0 left-0 right-0 flex justify-between items-center p-3 bg-gradient-to-b from-black/60 to-transparent z-10"
              onClick={handleChildClick}
            >
              <p
                id={`post-title-${post.id}`}
                className="text-base font-semibold text-white truncate mr-2"
              >
                {post.name}
              </p>
              <div
                title={post.User.name}
                className="flex items-center cursor-pointer flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${post.User.name}`);
                }}
              >
                <p className="mr-2 text-white text-sm hidden sm:block">
                  {post.User.name}
                </p>
                <Image
                  src={post.User.avatar || "/default-avatar.png"}
                  className="w-8 h-8 rounded-full object-cover border border-white/50"
                  alt={`${post.User.name}'s avatar`}
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        )}

        <div className={postContentClassName} onClick={handleChildClick}>
          {post.description && (
            <p className={postDescriptionClassName}>{post.description}</p>
          )}

          <div className={postActionsClassName}>
            <button
              title="Like"
              className={actionButtonClassName}
              onClick={handleLikeClick}
              aria-pressed={isLiked}
            >
              {isLiked ? (
                <BsHeartFill size={18} className="text-red-500" />
              ) : (
                <BsHeart size={18} />
              )}
              <span className="text-sm">{likeCount}</span>
            </button>
            <button
              title="Comments"
              className={actionButtonClassName}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/post/${post.id}#comments`);
              }}
            >
              <BsChatDots size={18} />
              <span className="text-sm">{post._count.Comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
