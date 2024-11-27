// pages/api/post/comment/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { z } from "zod";

// Схема валидации комментария
const commentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!["POST", "DELETE"].includes(req.method || "")) {
      return res
        .status(405)
        .json({ status: "error", message: "Unsupported method" });
    }

    await authMiddleware(req, res);
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const postId = parseInt(req.query.id as string, 10);
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    if (req.method === "DELETE") {
      const commentId = parseInt(req.query.commentId as string, 10);
      if (isNaN(commentId)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid comment ID" });
      }

      const comment = await prisma.comments.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return res
          .status(404)
          .json({ status: "error", message: "Comment not found" });
      }

      if (comment.userId !== user.id) {
        return res
          .status(403)
          .json({ status: "error", message: "Unauthorized" });
      }

      await prisma.comments.delete({
        where: { id: commentId },
      });

      return res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
      });
    }

    const { comment } = commentSchema.parse(req.body);

    const newComment = await prisma.comments.create({
      data: {
        comment,
        userId: user.id,
        postId,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
