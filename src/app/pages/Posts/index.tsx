import React, { useEffect, useState, useCallback, useMemo } from "react";

import PostList from "@/app/components/PostList";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import NoPostsFound from "@/app/components/NoPostsFound";

import { useUserContext } from "@/app/contexts/UserContext";

import * as postUtils from "@/app/utils/postUtils";

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

export default function Posts({ windowHeight, windowWidth, windowId }) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUserContext();

  const postsContainerStyle = useMemo(
    () => ({
      width: windowWidth - 10,
      height: windowHeight - 55,
    }),
    [windowWidth, windowHeight]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      if (hasMorePosts) {
        setLoading(true);
        setError(null);

        try {
          const newPosts = await postUtils.fetchPosts(page);
          if (newPosts.length === 0) {
            setHasMorePosts(false);
          } else {
            setPosts((prevPosts) =>
              page === 1 ? newPosts : [...prevPosts, ...newPosts]
            );
          }
        } catch (err) {
          console.error("Error fetching posts:", err);
          setError("Failed to load posts, please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPosts();
  }, [page, hasMorePosts]);

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.scrollY + window.innerHeight >=
          document.body.scrollHeight - 100 &&
        !loading &&
        hasMorePosts
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 200),
    [loading, hasMorePosts]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLoadMore = () => {
    setHasMorePosts(true);
    setPage(1);
  };

  const postList = useMemo(
    () => (
      <PostList
        posts={posts}
        windowHeight={windowHeight}
        windowWidth={windowWidth}
        windowId={windowId}
        user={user}
      />
    ),
    [posts, windowHeight, windowWidth]
  );

  return (
    <div
      id="posts"
      style={postsContainerStyle}
      className="relative flex flex-col items-center justify-center mx-auto"
    >
      {loading && page === 1 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          {posts.length > 0
            ? postList
            : !loading && <NoPostsFound className="text-center" />}
          {loading && hasMorePosts && <LoadingIndicator className="my-4" />}
          {!hasMorePosts && <LoadMoreButton onClick={handleLoadMore} />}
        </>
      )}
    </div>
  );
}
