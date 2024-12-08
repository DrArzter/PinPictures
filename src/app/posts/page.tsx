"use client";

import React, { useEffect, useState, useCallback } from "react";
import PostList from "../components/post/PostList";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingIndicator from "../components/common/LoadingIndicator";
import NoPostsFound from "../components/post/NoPostsFound";
import * as postUtils from "../utils/postUtils";

export default function Posts() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const minColumnWidth = 300;
  const maxColumns = 4;
  const [columns, setColumns] = useState<number>(1);

  const calculateColumns = useCallback(() => {
    if (typeof window !== "undefined") {
      const windowWidth = window.innerWidth;
      const newColumns = Math.max(
        1,
        Math.min(maxColumns, Math.floor(windowWidth / minColumnWidth))
      );
      setColumns(newColumns);
    }
  }, []);

  useEffect(() => {
    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => {
      window.removeEventListener("resize", calculateColumns);
    };
  }, [calculateColumns]);

  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMorePosts) return;

    setLoading(true);
    setError(null);

    try {
      const newPosts = await postUtils.fetchPosts(page);
      if (newPosts.length === 0) {
        setHasMorePosts(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      setError("Error fetching posts");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMorePosts]);

  useEffect(() => {
    fetchMorePosts();
  }, []);

  const retryFetch = () => {
    setError(null);
    fetchMorePosts();
  };

  return (
    <div
      id="posts"
      style={{
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
      className="relative"
    >
      {error && (
        <div className="flex flex-col items-center justify-center h-[85vh] md:h-[90vh]">
          {error}
          <button onClick={retryFetch} className="ml-2 text-blue-500 underline">
            Try again
          </button>
        </div>
      )}
      {posts.length > 0 ? (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMorePosts}
          loader={<LoadingIndicator />}
          endMessage={
            <div className="flex justify-center items-center text-center">
              <p className="text-lg font-semibold text-yellow-400">
                That's all for now 😊
              </p>
            </div>
          }
          style={{ width: "100%" }}
        >
          <PostList posts={posts} columns={columns} />
        </InfiniteScroll>
      ) : (
        !loading && !error && <NoPostsFound />
      )}
      {loading && page === 1 && (
        <div className="flex justify-center items-center h-[85vh] md:h-[90vh]">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
}
