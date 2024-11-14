// src/app/pages/Posts/index.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import PostList from "@/app/components/PostList";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import NoPostsFound from "@/app/components/NoPostsFound";

import { User, Post as PostType } from "@/app/types/global";

import * as postUtils from "@/app/utils/postUtils";

interface PostProps {
  windowHeight: number;
  windowWidth: number;
  windowId: number;
  user: User | null;
}

const Posts: React.FC<PostProps> = ({
  windowHeight,
  windowWidth,
  windowId,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postsContainerRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true); // Флаг для начальной загрузки

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
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMorePosts]);

  useEffect(() => {
    fetchMorePosts();
  }, []);

  useEffect(() => {
    if (initialLoad && postsContainerRef.current) {
      postsContainerRef.current.scrollTop = 0;
      setInitialLoad(false);
    }
  }, [initialLoad]);

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
    [posts, windowHeight, windowWidth, windowId, user]
  );

  const retryFetch = () => {
    setError(null);
    fetchMorePosts();
  };

  return (
    <div
      id="posts"
      ref={postsContainerRef}
      style={{
        width: windowWidth - 20,
        height: windowHeight - 60,
        overflow: "auto",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
      className="relative"
    >
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
          <button onClick={retryFetch} className="ml-2 text-blue-500 underline">
            Повторить попытку
          </button>
        </div>
      )}
      {posts.length > 0 ? (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMorePosts}
          loader={<LoadingIndicator className="my-4" />}
          endMessage={
            <div className="flex justify-center items-center text-center">
              <p className="text-lg font-semibold text-yellow-400">
                That's all for now 😊
              </p>
            </div>
          }
          scrollableTarget="posts"
          style={{ width: "100%" }}
        >
          {postList}
        </InfiniteScroll>
      ) : (
        !loading && <NoPostsFound className="text-center" />
      )}
      {loading && page === 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export default Posts;
