import React, { useContext, useEffect, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import type { Post as PostType } from "@/app/types/global";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as api from "@/app/api";

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const { addNotification } = useNotificationContext();
  const { user } = useUserContext();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post._count.Likes);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isImageError, setIsImageError] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (
      user &&
      post.Likes &&
      post.Likes.some((like) => like.userId === user.id)
    ) {
      setIsLiked(true);
    }
  }, [post.Likes, user]);

  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/post/${post.id}`);
  };

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      addNotification({
        status: "error",
        message: "You must be logged in to like posts.",
        time: 5000,
        clickable: true,
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
      addNotification({
        status: "error",
        message: "Failed to update like.",
        time: 5000,
        clickable: false,
      });
    }
  };

  const postContainerClassName = `hover:scale-105 border rounded-xl focus:scale-105 transition-transform duration-300 overflow-hidden`;
  const imageContainerClassName = "w-full overflow-hidden relative";
  const layersIconClassName = "absolute bottom-2 right-2 text-2xl text-yellow-500";
  const postContentClassName = "p-4 flex flex-row items-center justify-between";
  const postDescriptionClassName = "text-sm overflow-hidden line-clamp-3";
  const hasMultipleImages = post.ImageInPost && post.ImageInPost.length > 1;
  const postActionsClassName = "flex flex-row items-center space-x-4 mt-2";
  const likeButtonClassName =
    "flex items-center space-x-1 hover:text-yellow-500";
  const commentButtonClassName =
    "flex items-center space-x-1 hover:text-yellow-500";

  return (
    <div
      key={post.id}
      className={postContainerClassName}
      onClick={handlePostClick}
    >
      <div className="flex flex-col h-full">
        {post.ImageInPost && (
          <div className={imageContainerClassName}>
            {hasMultipleImages && <FiLayers title="Multiple images" className={layersIconClassName} />}

            <Image
              src={post.ImageInPost[0].picpath}
              alt={post.name}
              title={post.name}
              width={0}
              height={0}
              sizes="100vw"
              className="cursor-pointer w-full h-full object-cover"
              onLoadingComplete={() => setIsImageLoaded(true)}
              onError={() => setIsImageError(true)}
            />

            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
              <p className="text-lg font-semibold text-white">{post.name}</p>
              <div
                title={post.User.name}  
                className="flex items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${post.User.name}`);
                }}
              >
                <p className="mr-2 text-white">{post.User.name}</p>
                <img
                  src={post.User.avatar}
                  className="w-10 h-10 rounded-full"
                  alt={post.User.name}
                />
              </div>
            </div>
          </div>
        )}

        <div className={`h-[1px] w-full`} />

        <div className={postContentClassName} onClick={handleChildClick}>
          <p className={postDescriptionClassName}>{post.description}</p>
          <div className={postActionsClassName}>
            <button
              title="Like"
              className={likeButtonClassName}
              onClick={handleLikeClick}
            >
              {isLiked ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
              <span>{likeCount}</span>
            </button>
            <button
              title="Comments"
              className={commentButtonClassName}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/post/${post.id}`);
              }}
            >
              <BsChatDots size={20} />
              <span>{post._count.Comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
