"use client";
import React, { useState, FormEvent } from "react";
import CommentList from "@/app/components/comment/CommentList";
import { Comment } from "@/app/types/global";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (commentText: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div
      className="flex flex-col flex-grow overflow-hidden"
      id="comments-section"
    >
      <CommentList comments={comments} />
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded p-2 text-base outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter a comment..."
            aria-label="Enter a comment"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded px-4 py-2 transition-colors duration-200"
            aria-label="Send Comment"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
