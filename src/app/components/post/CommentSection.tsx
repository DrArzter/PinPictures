"use client";
import React, { useState, FormEvent, memo, useCallback } from "react";
import CommentList from "@/app/components/comment/CommentList";
import { Comment } from "@/app/types/global";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (commentText: string) => void;
  postId: number;
  setComments: (comments: Comment[]) => void;
}

// Выделим форму ввода комментария в отдельный компонент
const CommentForm = memo(({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment("");
    }
  }, [newComment, onSubmit]);

  return (
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
  );
});

CommentForm.displayName = 'CommentForm';

const CommentSection = memo(({ comments, onAddComment, postId, setComments }: CommentSectionProps) => {
  const handleAddComment = useCallback((text: string) => {
    onAddComment(text);
  }, [onAddComment]);

  return (
    <div
      className="flex flex-col flex-grow overflow-hidden"
      id="comments-section"
    >
      <CommentList comments={comments} postId={postId} setComments={setComments} />
      <CommentForm onSubmit={handleAddComment} />
    </div>
  );
});

CommentSection.displayName = 'CommentSection';

export default CommentSection;
