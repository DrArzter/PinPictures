import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ status: "error", message: "Method not supported" });
  }

  try {
    await authMiddleware(req, res);
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }


    const postId = parseInt(req.query.id as string);
    const commentId = parseInt(req.query.comment_id as string);
    
    if (isNaN(postId) || isNaN(commentId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid post ID or comment ID" });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Check if comment exists and belongs to the post
    const comment = await prisma.comments.findFirst({
      where: {
        id: commentId,
        postId: postId
      }
    });

    if (!comment) {
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });
    }

    if (comment.userId !== user.id && (typeof user.bananaLevel !== 'number' || user.bananaLevel < 1)) {
      return res.status(403).json({ status: "error", message: "Access denied" });
    }

    // Delete the comment
    await prisma.comments.delete({
      where: { id: commentId }
    });

    return res
      .status(200)
      .json({ status: "success", message: "Comment successfully deleted" });

  } catch (error) {
    return handleError(res, error);
  }
} 