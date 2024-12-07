import React from "react";
import { motion } from "framer-motion";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likeCount,
  onLike,
}) => {
  return (
    <motion.button
      className="flex items-center gap-1"
      onClick={onLike}
      aria-label={isLiked ? "Unlike" : "Like"}
      whileTap={{ scale: 0.8 }}
    >
      {isLiked ? (
        <BsHeartFill className="fill-yellow-500" size={20} />
      ) : (
        <BsHeart className="fill-yellow-500" size={20} />
      )}
      <span className="text-yellow-500">{likeCount}</span>
    </motion.button>
  );
};

export default LikeButton;
