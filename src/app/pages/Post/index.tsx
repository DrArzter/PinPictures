// DetailedPost.js
import React, { useEffect, useState, useContext } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import ThemeContext from "@/app/contexts/ThemeContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import * as api from "@/app/api";

export default function Post({ dynamicProps, windowHeight, windowWidth, user } : any) {
  const { isDarkMode } = useContext(ThemeContext);
  const { openWindowByPath } = useWindowContext() as any;
  const { addNotification } = useNotificationContext() as any;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await fetchPost(dynamicProps.id as any);
        setPost(fetchedPost as any);

        setLikeCount(fetchedPost._count ? fetchedPost._count.likes : 0 as any);
        setComments(fetchedPost.comments || [] as any);

        if (user && fetchedPost.likes.some((like : any) => like.userId === user.id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        addNotification({
          type: "error",
          message: "Не удалось загрузить пост.",
        } as any);
      } finally {
        setLoading(false as any);
      }
    };
    fetchPostData();
  }, [dynamicProps.id, user, addNotification]);

  const handleLikeClick = async () => {
    if (!user) {
      addNotification({
        type: "error",
        message: "Вы должны войти в систему, чтобы лайкать посты.",
      });
      return;
    }

    try {
      const response = await api.likePost(post.id as any);
      if (response.status === "success") {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState as any);
        setLikeCount((prevCount) => prevCount + (newLikeState ? 1 : -1) as any);
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
    setCurrentImage((prevIndex : any) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = (e : any) => {
    e.stopPropagation();
    setCurrentImage((prevIndex : any) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e : any) => {
    e.stopPropagation();
    setCurrentImage((prevIndex : any) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddComment = async (e : any) => {
    e.preventDefault();
    if (!user) {
      addNotification({
        type: "error",
        message: "Вы должны войти в систему, чтобы добавлять комментарии.",
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
      // Заглушка функции добавления комментария
      // Здесь вы можете вызвать API для добавления комментария
      console.log("Добавление комментария:", newComment);
      addNotification({
        type: "success",
        message: "Комментарий успешно добавлен (заглушка).",
      });

      // Обновление списка комментариев локально
      const addedComment = {
        id: Date.now(), // временный ID
        user: {
          name: user.name,
          avatar: user.avatar,
        },
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, addedComment] as any);
      setNewComment("" as any);
    } catch (error) {
      console.error("Error adding comment:", error);
      addNotification({
        type: "error",
        message: "Не удалось добавить комментарий.",
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
  const postContainerClassName = `relative flex flex-col items-center justify-center w-full max-w-3xl p-4 rounded-xl ${
    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  } bg-opacity-20 shadow-xl scrollbar-hidden`;

  return (
    <div style={{ height: `${windowHeight - 55}px` }} className="flex justify-center items-center p-4">
      <motion.div
        className={postContainerClassName}
        style={{ height: `${windowHeight - 55}px`, width: `${windowWidth}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Фоновое анимированное изображение */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={post.images[currentImage].picpath}
              alt="Background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center h-full w-full overflow-y-auto scrollbar-hidden">
          {/* Галерея изображений */}
          <div className="relative w-full max-w-4xl">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={post?.images[currentImage].picpath}
                  alt="Post Image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-auto max-h-[50vh] object-cover cursor-pointer"
                  loading="lazy"
                  onClick={handleImageClick}
                />
              </AnimatePresence>
            </div>
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

          {/* Секция деталей поста */}
          <motion.div className="p-6 mt-6 w-full max-w-3xl shadow-2xl">
            {/* Название и описание */}
            <h1 className="text-2xl font-bold">{post?.name}</h1>
            <p className="mt-4">{post.description}</p>

            {/* Действия: лайк и комментарии */}
            <div className="flex items-center space-x-4 mt-6">
              <button onClick={handleLikeClick} className="flex items-center space-x-1">
                {isLiked ? <BsHeartFill size={22} /> : <BsHeart size={22} />}
                <span>{likeCount}</span>
              </button>
              <button
                className="flex items-center space-x-1"
                onClick={() => openWindowByPath(`/post/${post.id}`)}
              >
                <BsChatDots size={22} />
                <span>{post._count.comments}</span>
              </button>
            </div>

            {/* Раздел комментариев */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Комментарии</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{comment.user.name}</p>
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Нет комментариев. Будьте первым!</p>
                )}
              </div>

              {/* Форма добавления комментария */}
              <form onSubmit={handleAddComment} className="mt-6 flex items-center space-x-3">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.name || "User"}
                  className="w-10 h-10 rounded-full"
                />
                {user ? (
                  <>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Добавьте комментарий..."
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-white placeholder-gray-400"
                          : "bg-gray-100 text-gray-900 placeholder-gray-500"
                      } focus:outline-none`}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Отправить
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Войдите, чтобы оставить комментарий.</p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
