// Post.jsx (or .tsx)
import React, { useEffect, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";

export default function Post({ postId }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      const fetchedPost = await fetchPost(postId);
      setPost(fetchedPost);
      setLoading(false);
    };
    fetchPostData();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div>
      <p>{post.name}</p>
      <p>{post.description}</p>
    </div>
  );
}
