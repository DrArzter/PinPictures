"use client";
import React from "react";
import Post from "./Post";
import { motion } from "framer-motion";
import { Post as PostType } from "@/app/types/global";

interface PostListProps {
  posts: PostType[];
  columns: number;
}

const PostList = ({ posts, columns }: PostListProps) => {
  const postListStyle = {
    columnCount: columns,
    columnGap: "16px",
    padding: "16px",
  };

  return (
    <div style={postListStyle}>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{ breakInside: "avoid", marginBottom: "16px" }}
        >
          <Post post={post} />
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(PostList);
