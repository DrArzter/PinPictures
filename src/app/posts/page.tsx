"use client";

import React, { useEffect, useState, useCallback } from "react";
import PostList from "../components/post/PostList";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingIndicator from "../components/common/LoadingIndicator";
import NoPostsFound from "../components/post/NoPostsFound";
import * as postUtils from "../utils/postUtils";
import { useColumnCount } from "../hooks/useColumnCount";
import { Post } from "@/app/types/global";

export default function Posts() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns = useColumnCount({ minColumnWidth: 300, maxColumns: 4 });

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
    } catch {
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
          loader={
            loading && hasMorePosts ? (
              <LoadingIndicator />
            ) : (
              <div className="flex justify-center items-center text-center">
                <p className="text-lg font-semibold text-yellow-400">
                  That is all for now 😊
                </p>
              </div>
            )
          }
          scrollableTarget="posts"
          endMessage={
            !hasMorePosts && posts.length > 0 ? (
              <div className="flex justify-center items-center text-center">
                <p className="text-lg font-semibold text-yellow-400">
                  That is all for now 😊
                </p>
              </div>
            ) : null
          }
          style={{ width: "100%" }}
        >
          <PostList posts={posts} columns={columns} />
        </InfiniteScroll>
      ) : (
        !loading && !error && <NoPostsFound />
      )}
      {loading && page === 1 && hasMorePosts && (
        <div className="flex justify-center items-center h-[85vh] md:h-[90vh]">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
}
