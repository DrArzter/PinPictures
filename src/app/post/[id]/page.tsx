"use client";

import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import * as api from "@/app/api";

import CommentList from "@/app/components/CommentList";

import { Post as PostType, User, Comment } from "@/app/types/global";
import { useUserContext } from "@/app/contexts/UserContext";
import ModalsContext from "@/app/contexts/ModalsContext";

interface PostProps {
  user: User | null;
}

/**
 * Component to display author's information including avatar and name.
 *
 * @param {User} user - The user object containing author details.
 * @param {string} createdAt - The creation date of the post, formatted as a locale string.
 * @returns A JSX element displaying the author's avatar, name, and post creation date.
 */
const AuthorInfo: React.FC<{ user: User; createdAt: string }> = ({
  user,
  createdAt,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.avatar}
        alt={`${user.name} avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-lg text-gray-900 dark:text-white">
          {user.name}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const ImageCarousel: React.FC<{
  images: { picpath: string }[];
  currentIndex: number;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onImageClick: () => void;
}> = ({ images, currentIndex, onPrev, onNext, onImageClick }) => {
  const hasMultipleImages = images.length > 1;

  return (
    <div className="w-full xl:w-1/2 relative flex items-center justify-center overflow-hidden rounded-lg">
      <div className="w-full h-[90vh] flex items-center justify-center">
        <img
          src={images[currentIndex].picpath}
          alt={`Post Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain cursor-pointer"
          loading="lazy"
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

const LikeButton: React.FC<{
  isLiked: boolean;
  likeCount: number;
  onLike: (e: React.MouseEvent) => void;
}> = ({ isLiked, likeCount, onLike }) => {
  return (
    <button
      className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
      onClick={onLike}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      {isLiked ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
      <span>{likeCount}</span>
    </button>
  );
};

const CommentSection: React.FC<{
  comments: Comment[];
  commentsCount: number;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  onAddComment: (e: React.FormEvent) => void;
}> = ({ comments, commentsCount, newComment, setNewComment, onAddComment }) => {
  return (
    <div className="mt-6" id="comments-section">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Comments ({commentsCount})
      </h2>
      <CommentList comments={comments} />
      <form onSubmit={onAddComment} className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded p-2 text-base outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            placeholder="Add a comment..."
            aria-label="Add a comment"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded px-4 py-2 transition-colors duration-200"
            aria-label="Send Comment"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Post() {
  const { addNotification } = useNotificationContext() as any;

  const { user } = useUserContext();

  const params = useParams();
  const postId = useMemo(
    () => (params.id ? parseInt(params.id, 10) : null),
    [params.id]
  );

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

  // Удаляем локальное состояние для модального окна
  // const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  // const [modalImageUrl, setModalImageUrl] = useState<string>("");

  // Используем контекст модальных окон
  const { openModal } = useContext(ModalsContext);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }
      try {
        const fetchedPost = await fetchPost(postId);
        setPost(fetchedPost);
        setLikeCount(fetchedPost._count?.Likes ?? fetchedPost.Likes.length);
        setComments(fetchedPost.Comments || []);
        setCommentsCount(
          fetchedPost._count?.Comments ?? fetchedPost.Comments.length
        );
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
  }, [postId, user, addNotification]);

  const handleLikeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        addNotification({
          status: "error",
          message: "You need to be logged in to like posts.",
          clickable: true,
          link_to: "/authentication",
        });
        return;
      }

      if (!post) return;

      try {
        const response = await api.likePost(post.id);
        if (response.status === "success") {
          const newLikeState = !isLiked;
          setIsLiked(newLikeState);
          setLikeCount((prev) => (newLikeState ? prev + 1 : prev - 1));
        }
      } catch (error) {
        console.error("Error updating like:", error);
        addNotification({
          status: "error",
          message: "Failed to update like.",
        });
      }
    },
    [user, post, isLiked, addNotification]
  );

  const handleImageClick = useCallback(() => {
    if (post && post.ImageInPost.length > 0) {
      // Используем контекст для открытия модального окна
      openModal("FULL_SCREEN_IMAGE", {
        imageUrl: post.ImageInPost[currentImage].picpath,
      });
    }
  }, [post, currentImage, openModal]);

  // Удаляем функции закрытия модального окна
  // const closeImageModal = useCallback(() => {
  //   setIsImageModalOpen(false);
  //   setModalImageUrl("");
  // }, []);

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!post) return;
      setCurrentImage((prev) =>
        prev === 0 ? post.ImageInPost.length - 1 : prev - 1
      );
    },
    [post]
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!post) return;
      setCurrentImage((prev) =>
        prev === post.ImageInPost.length - 1 ? 0 : prev + 1
      );
    },
    [post]
  );

  const handleAddComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        addNotification({
          status: "error",
          message: "You need to be logged in to comment.",
          clickable: true,
          link_to: "/authentication",
        });
        return;
      }

      if (newComment.trim() === "") {
        addNotification({
          status: "error",
          message: "Comment cannot be empty.",
        });
        return;
      }

      if (!post) return;

      try {
        const response = await api.uploadComment(post.id, newComment.trim());
        if (response.status === "success") {
          addNotification({
            status: "success",
            message: response.message,
          });
          const addedComment: Comment = {
            id: Date.now(),
            User: {
              name: user.name,
              avatar: user.avatar,
            },
            text: newComment.trim(),
            createdAt: new Date().toISOString(),
          };
          setComments((prev) => [...prev, addedComment]);
          setNewComment("");
          setCommentsCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        addNotification({
          status: "error",
          message: "Failed to add comment.",
        });
      }
    },
    [user, newComment, post, addNotification]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <LoadingIndicator />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-gray-700 dark:text-gray-300">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center px-4 py-6 gap-6 h-[90vh]">
      {/* Image Carousel */}
      <ImageCarousel
        images={post.ImageInPost}
        currentIndex={currentImage}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        onImageClick={handleImageClick}
      />

      {/* Content Section */}
      <div className="w-full xl:w-1/2 flex flex-col rounded-lg shadow-2xl p-6 h-[90vh]">
        {/* Author Info */}
        <AuthorInfo user={post.User} createdAt={post.createdAt} />

        {/* Post Title и Description */}
        <div className="mt-4">
          <h1 className="font-bold text-3xl mb-4 text-yellow-500">
            {post.name}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
        </div>

        {/* Like и Comment Buttons */}
        <div className="flex items-center gap-6 mt-4">
          <LikeButton
            isLiked={isLiked}
            likeCount={likeCount}
            onLike={handleLikeClick}
          />
          <button
            className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
            onClick={() => {
              const commentSection =
                document.getElementById("comments-section");
              if (commentSection) {
                commentSection.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
            aria-label="View Comments"
          >
            <BsChatDots size={20} />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={comments}
          commentsCount={commentsCount}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}
