// pages/api/post/comment/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { z } from "zod";

const commentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

interface CustomNextApiRequest extends NextApiRequest {
  user?: any;
}

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  try {
    await authMiddleware(req, res);
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid request body" });
    }

    const { comment } = commentSchema.parse(req.body);

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

    const newComment = await prisma.comments.create({
      data: {
        comment: comment,
        userId: user.id,
        postId: postId,
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
