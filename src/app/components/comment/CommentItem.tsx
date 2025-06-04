// CommentItem.tsx
import React from "react";
import { Comment } from "@/app/types/global";
import { ImBin2 } from "react-icons/im";
import { useUserContext } from "@/app/contexts/UserContext";
import { deleteComment } from "@/app/api";
import { useNotificationContext } from "@/app/contexts/NotificationContext";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  setComments: (comments: Comment[] | ((prev: Comment[]) => Comment[])) => void;
}

export default function CommentItem({ comment, postId, setComments }: CommentItemProps) {
  const { user } = useUserContext();
  const { addNotification } = useNotificationContext();

  const handleDeleteComment = () => {
    deleteComment(postId, comment.id).then((res) => {
      addNotification({
        status: res.data.status,
        message: res.data.message,
      });
      if (res.data.status === "success") {
        setComments((prev: Comment[]) => prev.filter((c) => c.id !== comment.id));
      }
    });
  };

  return (
    <div className="flex flex-row gap-4 items-start mt-4 p-3 border rounded-lg shadow-sm">
      <img
        src={comment.User.avatar}
        alt="Comment Author Avatar"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col w-full">
        {(comment.User.id === user?.id || (typeof user?.bananaLevel !== 'number' || user?.bananaLevel >= 1)) && (
          <p className="flex flex-row justify-between w-full font-bold">
            {comment.User.name}
            <button onClick={handleDeleteComment}>
              <ImBin2 className="w-4 h-4" />
            </button>
          </p>
        )}
        <p>{comment.comment}</p>
        <p className="text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
