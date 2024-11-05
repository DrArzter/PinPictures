import React, { useMemo } from "react";
import Post from "./Post";
import { motion } from "framer-motion";

export default function PostList({
  posts,
  windowHeight,
  windowWidth,
  windowId,
  ...props
}) {
  const minColumnWidth = 300;
  const maxColumns = 4;

  const columns = Math.max(
    1,
    Math.min(maxColumns, Math.floor(windowWidth / minColumnWidth))
  );

  const postListStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: "16px",
    height: windowHeight,
    overflowY: "scroll",
    padding: "16px",
  };

  const postItems = useMemo(
    () =>
      posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Post
            post={post}
            windowHeight={windowHeight}
            windowId={windowId}
            {...props}
          />
        </motion.div>
      )),
    [posts, windowHeight, windowId]
  );

  return (
    <div className="scrlBar overflow-hidden max-h-full" style={postListStyle}>
      {postItems}
    </div>
  );
}
