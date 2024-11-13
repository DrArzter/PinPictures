import React, { useMemo } from "react";
import Post from "./Post";
import { motion } from "framer-motion";
import type { Post as PostType, User } from "@/app/types/global"; // Импорт интерфейсов Post и User

interface PostListProps {
  posts: PostType[];
  windowHeight: number;
  windowWidth: number;
  windowId: number;
  user: User | null;
}

export default function PostList({
  posts,
  windowHeight,
  windowWidth,
  windowId,
  user,
  ...props
}: PostListProps) {
  const minColumnWidth = 300;
  const maxColumns = 4;

  const columns = Math.max(
    1,
    Math.min(maxColumns, Math.floor(windowWidth / minColumnWidth))
  );

  const postListStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: "16px",
    height: windowHeight,
    overflowY: "scroll" as React.CSSProperties["overflowY"],
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
            user={user} // Передаем user в компонент Post
            {...props}
          />
        </motion.div>
      )),
    [posts, windowHeight, windowId, user]
  );

  return (
    <div className="scrlBar overflow-hidden max-h-full" style={postListStyle}>
      {postItems}
    </div>
  );
}
