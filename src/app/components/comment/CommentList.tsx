import React from "react";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: any[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="flex-grow overflow-y-auto border-t mt-4 pt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={String(comment.id)} comment={comment} />
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No comments yet, be the first to leave one!
        </p>
      )}
    </div>
  );
}
