// Post.jsx
import React, { useEffect, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function Post({ dynamicProps, windowHeight, windowWidth }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  console.log(dynamicProps);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await fetchPost(dynamicProps.id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, []);

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

  const prevImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleLike = () => {
    setLiked(!liked);
    // Здесь можно добавить логику отправки лайка на сервер
  };

  // Анимации Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <motion.div
      className="relative w-full py-4 px-4 rounded-xl"
      style={{ height: `${windowHeight - 55}px`, overflow: "hidden" }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
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

      <div className="relative z-10 flex flex-col items-center h-full overflow-y-auto">
        {/* Галерея изображений */}
        <div className="relative w-full max-w-4xl">
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={post.images[currentImage].picpath}
                alt="Post Image"
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full h-auto max-h-[50vh] object-cover cursor-pointer"
                loading="lazy"
                onClick={nextImage}
              />
            </AnimatePresence>
          </div>

          {post.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full ml-2 focus:outline-none"
              >
                <AiOutlineLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full mr-2 focus:outline-none"
              >
                <AiOutlineRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Индикаторы изображений */}
        {post.images.length > 1 && (
          <div className="flex space-x-2 mt-2">
            {post.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 w-8 rounded-full focus:outline-none transition-colors duration-300 ${index === currentImage ? "bg-white" : "bg-gray-500"
                  }`}
              ></button>
            ))}
          </div>
        )}

        {/* Детали поста */}
        <motion.div
          className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 mt-6 w-full max-w-3xl shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold mb-2 sm:mb-0">
              {post.name}
            </h1>
            <p className="text-sm text-gray-300">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-base mb-4">{post.description}</p>

          {/* Информация об авторе */}
          <div className="flex items-center mb-4">
            <img
              src={post.author.avatar}
              alt="Author Avatar"
              className="w-14 h-14 rounded-full mr-3 border-2 border-white shadow-lg"
            />
            <div>
              <p className="text-xl font-semibold">{post.author.name}</p>
              {post.author.bio && (
                <p className="text-sm text-gray-400">{post.author.bio}</p>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLike}
              className={`flex items-center space-x-1 transition-colors duration-300 focus:outline-none ${liked ? "text-red-500" : "hover:text-red-500"
                }`}
            >
              {liked ? <BsHeartFill size={22} /> : <BsHeart size={22} />}
              <motion.span
                key={liked ? "liked" : "unliked"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {liked ? post.likesCount + 1 : post.likesCount}
              </motion.span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300 focus:outline-none">
              <BsChatDots size={22} />
              <span>{post.commentsCount || 0}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
