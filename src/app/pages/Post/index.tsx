import React, { useEffect, useState, useContext } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import ThemeContext from "@/app/contexts/ThemeContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import * as api from "@/app/api";

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

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await fetchPost(dynamicProps.id);
        setPost(fetchedPost);
        setLikeCount(fetchedPost._count ? fetchedPost._count.likes : 0);
        setComments(fetchedPost.comments || []);
        setCommentsCount(fetchedPost._count ? fetchedPost._count.comments : 0);
        if (user && fetchedPost.likes.some((like) => like.userId === user.id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        addNotification({
          type: "error",
          message: "Failed to load post.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [dynamicProps.id, user, addNotification]);

  const handleLikeClick = async () => {
    if (!user) {
      addNotification({
        type: "error",
        message: "You must be logged in to like posts.",
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
        message: "Failed to update like.",
      });
    }
  };

  const handleImageClick = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === post!.images.length - 1 ? 0 : prevIndex + 1
    );
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
        message: "You must be logged in to add a comment.",
      });
      return;
    }

    if (newComment.trim() === "") {
      addNotification({
        type: "error",
        message: "Comment cannot be empty.",
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
      }
      const addedComment = {
        id: Date.now(),
        author: {
          name: user.name,
          avatar: user.avatar,
        },
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      addNotification({
        type: "error",
        message: "An error occurred while adding the comment.",
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
        <p>Post not found</p>
      </div>
    );
  }

  const hasMultipleImages = post?.images && post?.images.length > 1;
  const isWideScreen = windowWidth > 1260;

  return (
    <div
      className={`flex ${isWideScreen ? "flex-row" : "flex-col"} items-center justify-center`}
      style={{ height: `${windowHeight - 55}px` }}
    >
      <div
        className={`${
          isWideScreen ? "w-1/2 h-full" : "w-full"
        } relative flex items-center justify-center overflow-hidden`}
        style={isWideScreen ? { height: "100%" } : {}}
      >
        <img
          src={post.images[currentImage].picpath}
          alt="Post Image"
          className="object-cover w-full h-full cursor-pointer"
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
              src={post.author.avatar}
              alt="Author Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-bold">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          <button onClick={handleLikeClick} className="flex items-center gap-1">
            {isLiked ? <BsHeartFill className="text-red-500" /> : <BsHeart />}
            <span>{likeCount}</span>
          </button>
        </div>
        <div className="mt-4">
          <p>{post.name}</p>
          <p>{post.description}</p>
        </div>
        <div className="mt-4">
          <p className="font-bold">Comments:</p>
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-row gap-2 items-center mt-2">
              <img
                src={comment.author.avatar}
                alt="Comment Author Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">{comment.author.name}</p>
                <p>{comment.comment}</p>
                <p className="text-sm text-gray-500">{comment.createdAt}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="mt-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border rounded w-full p-2"
              placeholder="Add a comment..."
            />
            <button type="submit" className="btn-primary mt-2">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
