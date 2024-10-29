import React, { useMemo } from "react";
import Post from "./Post";

export default function PostList({ posts, windowHeight, windowWidth }) {
  const minColumnWidth = 300;
  const maxColumns = 4;

  const columns = Math.max(1, Math.min(maxColumns, Math.floor(windowWidth / minColumnWidth)));

  const postListStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '16px',
    height: windowHeight,
    overflowY: 'scroll',
    padding: '16px',
  };

  const postItems = useMemo(() => (
    posts.map((post) => <Post key={post.id} post={post} windowHeight={windowHeight} />) // Pass windowHeight to Post
  ), [posts, windowHeight]);

  return (
    <div
      className="overflow-hidden"
      style={postListStyle}
    >
      {postItems}
    </div>
  );
}
