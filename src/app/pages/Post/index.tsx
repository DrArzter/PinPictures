import React, { useEffect, useState, useContext } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import ThemeContext from "@/app/contexts/ThemeContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import * as api from "@/app/api";

import CommentList from "@/app/components/CommentList";
import FullScreenImage from "@/app/components/modals/FullScreenImageModal";

import { Post as PostType, User } from "@/app/types/global";

interface PostProps {
  dynamicProps: PostType;
  windowHeight: number;
  windowWidth: number;
  user: User | null;
}

export default function Post({
  dynamicProps,
  windowHeight,
  windowWidth,
  user,
}: PostProps) {
  const { isDarkMode } = useContext(ThemeContext);
  const { openWindowByPath } = useWindowContext() as any;
  const { addNotification } = useNotificationContext() as any;

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [newComment, setNewComment] = useState("");

  // Fullscreen modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await fetchPost(dynamicProps.id);
        setPost(fetchedPost);
        setLikeCount(fetchedPost._count ? fetchedPost._count.Likes : 0);
        setComments(fetchedPost.Comments || []);
        setCommentsCount(fetchedPost._count ? fetchedPost._count.Comments : 0);
        if (user && fetchedPost.Likes.some((like) => like.userId === user.id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        addNotification({
          type: "error",
          message: "Failed to fetch post.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [dynamicProps.id, user, addNotification]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      addNotification({
        type: "error",
        message: "You have to be authorized to like posts.",
        clickable: true,
        link_to: "/authentication",
      });
      return;
    }

    try {
      const response = await api.likePost(post!.id);
      if (response.status === "success") {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState);
        setLikeCount((prevCount) => prevCount + (newLikeState ? 1 : -1));
      }
    } catch (error) {
      console.error("Error updating like:", error);
      addNotification({
        type: "error",
        message: "Не удалось обновить лайк.",
      });
    }
  };

  const handleImageClick = () => {
    const imageUrl = post!.images[currentImage].picpath;
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageUrl("");
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? post!.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prevIndex) =>
      prevIndex === post!.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addNotification({
        type: "error",
        message: "You have to be authorized to leave a comment.",
        clickable: true,
        link_to: "/authentication",
      });
      return;
    }

    if (newComment.trim() === "") {
      addNotification({
        type: "error",
        message: "Комментарий не может быть пустым.",
      });
      return;
    }

    try {
      const response = await api.uploadComment(post!.id, newComment);
      if (response.status === "success") {
        addNotification({
          type: response.status,
          message: response.message,
        });
        const addedComment = {
          id: Date.now(),
          User: {
            name: user.name,
            avatar: user.avatar,
          },
          text: newComment,
          createdAt: new Date().toISOString(),
        };
        setComments([...comments, addedComment]);
        setNewComment("");
        setCommentsCount(commentsCount + 1);
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Произошла ошибка при добавлении комментария.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Пост не найден</p>
      </div>
    );
  }

  const hasMultipleImages = post?.images && post?.images.length > 1;
  const isWideScreen = windowWidth > 1260;

  return (
    <div
      className={`flex ${
        isWideScreen ? "flex-row" : "flex-col"
      } items-center justify-center`}
      style={{ height: `${windowHeight - 55}px` }}
    >
      <div
        className={`${
          isWideScreen ? "w-1/2 h-full" : "w-full"
        } relative flex items-center justify-center overflow-hidden`}
        style={{
          height: isWideScreen ? "100%" : `${windowHeight * 0.5}px`,
        }}
      >
        <img
          src={post.ImageInPost[currentImage].picpath}
          alt="Post Image"
          className="w-full h-full object-cover cursor-pointer"
          loading="lazy"
          onClick={handleImageClick}
        />
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1"
            >
              <AiOutlineLeft size={24} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1"
            >
              <AiOutlineRight size={24} />
            </button>
          </>
        )}
      </div>

      <div
        className={`${
          isWideScreen ? "w-1/2 h-full overflow-y-auto p-6" : "w-full p-6 mt-6"
        } flex flex-col justify-start shadow-2xl`}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <img
              src={post.User.avatar}
              alt="Author Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-bold">{post.User.name}</p>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-4xl mb-4 text-yellow-500">
            {post.name}
          </h1>
          <p className="text-gray-700">{post.description}</p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            className="flex items-center gap-1 text-yellow-500"
            onClick={handleLikeClick}
          >
            {isLiked ? (
              <BsHeartFill className="text-yellow-500" size={20} />
            ) : (
              <BsHeart size={20} />
            )}
            <span>{likeCount}</span>
          </button>
          <button
            className="flex items-center gap-1 text-yellow-500"
            onClick={() => console.log("Comment button clicked")}
          >
            <BsChatDots size={20} />
            <span>{commentsCount}</span>
          </button>
        </div>

        <div className="mt-4">
          <CommentList comments={comments} windowHeight={windowHeight} />
          <form onSubmit={handleAddComment} className="mt-4">
            <div className="flex flex-row gap-2 items-center w-full">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border rounded w-full p-2 text-base outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Add a comment..."
              />
              <button
                type="submit"
                className="btn-primary bg-yellow-500 text-white font-semibold rounded px-4"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FullScreen Modal */}
      {isImageModalOpen && (
        <FullScreenImage imageUrl={modalImageUrl} onClose={closeImageModal} />
      )}
    </div>
  );
}
