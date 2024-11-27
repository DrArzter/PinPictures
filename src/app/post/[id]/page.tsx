"use client";

import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import LoadingIndicator from "@/app/components/common/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import * as api from "@/app/api";

import CommentList from "@/app/components/comment/CommentList";

import { Post as PostType, User, Comment } from "@/app/types/global";
import { useUserContext } from "@/app/contexts/UserContext";
import ModalsContext from "@/app/contexts/ModalsContext";

interface PostProps {
  user: User | null;
}

/**
 * Компонент для отображения информации об авторе.
 */
const AuthorInfo: React.FC<{ user: User; createdAt: string }> = ({
  user,
  createdAt,
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-4">
      <div className="rounded-full cursor-pointer border border-yellow-500">
        <Image
          onClick={() => router.push(`/profile/${user.name}`)}
          src={user.avatar}
          alt={`${user.name} avatar`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full rounded-full"
        />
      </div>
      <div>
        <p
          onClick={() => router.push(`/profile/${user.name}`)}
          className="font-semibold text-lg cursor-pointer"
        >
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

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-lg">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={images[currentIndex].picpath}
          alt="Post Image"
          width={0}
          height={0}
          sizes="100vw"
          className="cursor-pointer w-full h-full object-cover"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageError(true)}
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
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  onAddComment: (e: React.FormEvent) => void;
}> = ({ comments, newComment, setNewComment, onAddComment }) => {
  return (
    <div
      className="flex flex-col flex-grow overflow-hidden"
      id="comments-section"
    >
      <CommentList comments={comments} />
      <form onSubmit={onAddComment} className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded p-2 text-base outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter a comment..."
            aria-label="Enter a comment"
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
  const [newComment, setNewComment] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"image" | "details" | "comments">(
    "image"
  );

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
        if (user && fetchedPost.Likes.some((like) => like.userId === user.id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        addNotification({
          type: "error",
          message: "Не удалось загрузить пост.",
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
          message: "Необходимо войти в систему, чтобы ставить лайки.",
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
          message: "Не удалось обновить лайк.",
        });
      }
    },
    [user, post, isLiked, addNotification]
  );

  const handleImageClick = useCallback(() => {
    if (post && post.ImageInPost.length > 0) {
      openModal("FULL_SCREEN_IMAGE", {
        imageUrl: post.ImageInPost[currentImage].picpath,
      });
    }
  }, [post, currentImage, openModal]);

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
          message: "Please log in to add a comment.",
          clickable: true,
          link_to: "/authentication",
        });
        return;
      }

      if (newComment.trim() === "") {
        addNotification({
          status: "error",
          message: "Please enter a comment first.",
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
            comment: newComment.trim(),
            createdAt: new Date().toISOString(),
          };
          setComments((prev) => [...prev, addedComment]);
          setNewComment("");
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
      <div className="flex justify-center items-center h-[85vh] md:h-[90vh]">
        <LoadingIndicator />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-[85vh] md:h-[90vh]">
        <p className="text-gray-700 dark:text-gray-300">Post not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Мобильная версия */}
      <div className="flex flex-col items-center justify-center px-4 py-6 gap-6 h-[85vh] md:hidden">
        {/* Вкладки */}
        <div className="flex justify-around w-full border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === "image"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : ""
            }`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "details"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "comments"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : ""
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>

        {/* Контент вкладок */}
        <div className="flex-grow w-full overflow-y-auto">
          {activeTab === "image" && (
            <div className="h-full">
              <ImageCarousel
                images={post.ImageInPost}
                currentIndex={currentImage}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
                onImageClick={handleImageClick}
              />
            </div>
          )}
          {activeTab === "details" && (
            <div className="p-6">
              <AuthorInfo user={post.User} createdAt={post.createdAt} />
              {/* Заголовок и описание */}
              <div className="mt-4">
                <h1 className="font-bold text-3xl mb-4 text-yellow-500">
                  {post.name}
                </h1>
                <p className="text-gray-700 dark:text-gray-300">
                  {post.description}
                </p>
              </div>
              {/* Кнопки лайка и комментариев */}
              <div className="flex items-center gap-6 mt-4">
                <LikeButton
                  isLiked={isLiked}
                  likeCount={likeCount}
                  onLike={handleLikeClick}
                />
                <button
                  className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                  onClick={() => setActiveTab("comments")}
                  aria-label="View Comments"
                >
                  <BsChatDots size={20} />
                  <span>{comments.length}</span>
                </button>
              </div>
            </div>
          )}
          {activeTab === "comments" && (
            <div className="p-6 h-full flex flex-col">
              <CommentSection
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={handleAddComment}
              />
            </div>
          )}
        </div>
      </div>

      {/* Десктопная версия */}
      <div className="hidden md:flex flex-row items-center justify-center px-4 py-6 gap-6 h-[90vh]">
        {/* Карусель изображений */}
        <div className="w-1/2 h-full">
          <ImageCarousel
            images={post.ImageInPost}
            currentIndex={currentImage}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            onImageClick={handleImageClick}
          />
        </div>

        {/* Секция контента */}
        <div className="w-1/2 h-full flex flex-col rounded-lg shadow-2xl p-6 overflow-hidden">
          {/* Информация об авторе */}
          <AuthorInfo user={post.User} createdAt={post.createdAt} />

          {/* Заголовок и описание */}
          <div className="mt-4">
            <h1 className="font-bold text-3xl mb-4 text-yellow-500">
              {post.name}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              {post.description}
            </p>
          </div>

          {/* Кнопки лайка и комментариев */}
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
              <span>{comments.length}</span>
            </button>
          </div>

          {/* Секция комментариев */}
          <div className="flex-grow flex flex-col overflow-hidden">
            <CommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </div>
    </>
  );
}
