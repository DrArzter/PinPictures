import React, { useEffect, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useUserContext } from "@/app/contexts/UserContext";
import type { Post as PostType } from "@/app/types/global";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as api from "@/app/api";

// Helper function to get a blurred small version of an image
const getBlurredImageUrl = (url: string) => {
  // For images coming from your own domain, you can append query params
  // This approach works if you have an image optimization service
  if (url.includes('?')) {
    return `${url}&quality=10&width=50`;
  } else {
    return `${url}?quality=10&width=50`;
  }
};

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const { addNotification } = useNotificationContext();
  const { user } = useUserContext();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post._count.Likes);

  const router = useRouter();

  useEffect(() => {
    if (post.isLiked === true) {
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

    try {
      api.likePost(post.id).then((response) => {
        if (response.data.status === "success") {
          const newLikeState = !isLiked;
          setIsLiked(newLikeState);
          setLikeCount((prevCount) => prevCount + (newLikeState ? 1 : -1));
        }
      });
    } catch {
      addNotification({
        status: "error",
        message: "Failed to update like.",
      });
    }
  };

  const postContainerClassName = `border rounded-xl transition-transform duration-300 overflow-hidden`;
  const imageContainerClassName = "w-full overflow-hidden relative";
  const layersIconClassName =
    "absolute bottom-2 right-2 text-2xl text-yellow-500";
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
            {hasMultipleImages && (
              <FiLayers
                title="Multiple images"
                className={layersIconClassName}
              />
            )}

            {post.ImageInPost[0] && (
              <div className="w-full relative overflow-hidden">
                <Image
                  src={post.ImageInPost[0]?.picpath}
                  alt={post.name}
                  title={post.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '600px',
                    transition: 'filter 0.3s ease',
                  }}
                  placeholder="blur"
                  blurDataURL={getBlurredImageUrl(post.ImageInPost[0]?.picpath)}
                  className="cursor-pointer hover:brightness-75"
                />

              </div>
            )}

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
