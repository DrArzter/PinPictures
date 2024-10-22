import React, { useMemo } from "react";
import Post from "./Post";

// Memoized Post List to avoid unnecessary re-renders
export default function PostList({ posts }) {
  const postListClassName = "3xl:columns-8 md:columns-4 columns-2 gap-x-[16px] space-y-[15px] overflow-y-auto";

  const postItems = useMemo(() => (
    posts.map((post) => <Post key={post.id} post={post} />)
  ), [posts]);

  return <div className={postListClassName}>{postItems}</div>;
}
