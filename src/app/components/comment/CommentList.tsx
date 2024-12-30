import { memo } from 'react';
import CommentItem from "./CommentItem";
import { Comment } from '@/app/types/global';

interface CommentListProps {
  comments: Comment[];
}

const CommentList = memo(({ comments }: CommentListProps) => {
  return (
    <div className="flex-grow overflow-y-auto md:border-t md:mt-4 pt-4">
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
});

CommentList.displayName = 'CommentList';

export default CommentList;
