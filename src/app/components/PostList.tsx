// src/app/components/PostList.tsx
import React, { useMemo } from "react";
import Post from "./Post";
import { motion } from "framer-motion";
import type { Post as PostType, User } from "@/app/types/global";

interface PostListProps {
  posts: PostType[];
  windowHeight: number;
  windowWidth: number;
  windowId: number;
  user: User | null;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  windowHeight,
  windowWidth,
  windowId,
  user,
  ...props
}) => {
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
            user={user}
            {...props}
          />
        </motion.div>
      )),
    [posts, windowHeight, windowId, user]
  );

  return <div style={postListStyle}>{postItems}</div>;
};

export default React.memo(PostList);
