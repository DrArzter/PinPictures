import React from "react";
import Comment from "./Comment";
import { Comment as CommentType } from "@/app/types/global";

interface CommentListProps {
  comments: CommentType[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="border-t mt-4 pt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No comments yet, be the first to leave one!
        </p>
      )}
    </div>
  );
}
