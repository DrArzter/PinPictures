import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { z } from "zod";
import { RateLimiterMemory } from "rate-limiter-flexible";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Настройка рейтлимитера
const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 5,
});

const likeSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid post ID"),
});

export default async function handler(
  req: NextApiRequest,
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

    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid post ID" });
    }

    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User not authenticated" });
    }

    try {
      await rateLimiter.consume(user.id.toString()); // Проверка лимита по user.id
    } catch {
      return res
        .status(429)
        .json({ status: "error", message: "Too many requests. Please wait." });
    }

    // Лайк или удаление лайка
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
      await prisma.likes.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.likes.create({
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
    if (error instanceof RateLimiterMemory) {
      return res
        .status(429)
        .json({ status: "error", message: "Too many requests" });
    }
    return handleError(res, error);
  }
}
