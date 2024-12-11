// pages/api/post/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!["GET", "DELETE"].includes(req.method || "")) {
      return res
        .status(405)
        .json({ status: "error", message: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing post ID" });
    }

    const postId = parseInt(id as string, 10);
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid post ID" });
    }

    // Если метод DELETE, выполнить удаление поста
    if (req.method === "DELETE") {
      await authMiddleware(req, res);
      const user = req.user;

      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      // Проверка существования поста
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res
          .status(404)
          .json({ status: "error", message: "Post not found" });
      }

      if (post.authorId !== user.id) {
        return res
          .status(403)
          .json({ status: "error", message: "Unauthorized" });
      }

      // Удаление поста
      await prisma.post.delete({
        where: { id: postId },
      });

      return res
        .status(200)
        .json({ status: "success", message: "Post deleted" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        ImageInPost: true,
        Likes: {
          select: {
            userId: true,
          },
        },
        Comments: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
            User: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            Comments: true,
            Likes: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error handling post:", error);
    return handleError(res, error);
  }
}
