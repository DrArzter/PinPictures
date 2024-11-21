// pages/api/post/like/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { z } from "zod";

export const config = {
  api: {
    bodyParser: true,
  },
};

const likeSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid post ID"),
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

    const { id } = likeSchema.parse(req.query);
    const postId = parseInt(id, 10);
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User not authenticated" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { Likes: true },
    });

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    const existingLike = await prisma.likes.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });

    if (existingLike) {
      await prisma.Likes.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.Likes.create({
        data: {
          postId,
          userId: user.id,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Like updated successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
}
