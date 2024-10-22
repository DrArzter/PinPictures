import React, { useEffect, useState, useCallback } from "react";

import PostList from "@/app/components/PostList";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import NoPostsFound from "@/app/components/NoPostsFound";

import * as postUtils from "@/app/utils/postUtils";

// Дебаунс с очисткой таймера
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const LoadMoreButton = ({ onClick }) => (
  <div
    className="flex justify-center items-center mt-16 text-center cursor-pointer"
    onClick={onClick}
  >
    <p className="text-lg font-semibold text-yellow-400">
      That's all for now, but you can try again later :)
    </p>
  </div>
);

export default function Posts() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (hasMorePosts) {
        setLoading(true);
        setError(null); // Сбрасываем ошибку перед новым запросом

        try {
          const newPosts = await postUtils.fetchPosts(page);
          if (newPosts.length === 0) {
            setHasMorePosts(false); // Если больше нет постов
          } else {
            setPosts((prevPosts) =>
              page === 1 ? newPosts : [...prevPosts, ...newPosts]
            );
          }
        } catch (err) {
          console.error("Error fetching posts:", err);
          setError("Failed to load posts, please try again later.");
        } finally {
          setLoading(false); // Всегда отключаем индикатор загрузки
        }
      }
    };

    fetchPosts();
  }, [page, hasMorePosts]);

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.scrollY + window.innerHeight >=
          document.body.scrollHeight - 100 && // Примерно 100px до конца страницы
        !loading &&
        hasMorePosts
      ) {
        setPage((prevPage) => prevPage + 1); // Увеличиваем страницу
      }
    }, 200),
    [loading, hasMorePosts]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Чистим обработчик скролла при размонтировании
  }, [handleScroll]);

  const handleLoadMore = () => {
    setHasMorePosts(true); // Если нужно снова пробовать загружать
    setPage(1); // Можно сбросить на первую страницу, если требуется полный перезагруз
  };

  const postsContainerClassName = "w-full p-[14px] animate-slide-up absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full";

  return (
    <>
      {loading && page === 1 ? ( // Показываем индикатор при первой загрузке
        <LoadingIndicator />
      ) : (
        <div id="posts" className={postsContainerClassName}>
          {error && <div className="text-red-500">{error}</div>}
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            !loading && <NoPostsFound /> // Показываем если нет постов и загрузка завершена
          )}
          {loading && hasMorePosts && <LoadingIndicator />}
          {!hasMorePosts && <LoadMoreButton onClick={handleLoadMore} />}
        </div>
      )}
    </>
  );
}
