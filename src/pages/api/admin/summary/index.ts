// Получитть всех пользщователей из БД, проврить, что тот кто отправил запрос имеет в бд bananLevel >= 1, вернуть пользователей

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
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

    if (user.bananaLevel < 1) {
      return res
        .status(403)
        .json({ status: "error", message: "Access denied" });
    }

    const usersCount = await prisma.user.count();
    const postsCount = await prisma.post.count();
    const commentsCount = await prisma.comments.count();
    const likesCount = await prisma.likes.count();
    const messagesInChats = await prisma.messagesInChats.count();
    const chatsCount = await prisma.chats.count();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const newUsersCount = await prisma.user.count({
      where: {
        createdAt: { gt: startOfDay },
      },
    });
    const newPostsCount = await prisma.post.count({
      where: {
        createdAt: { gt: startOfDay },
      },
    });
    const newCommentsCount = await prisma.comments.count({
      where: {
        createdAt: { gt: startOfDay },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Users count",
      data: {
        usersCount,
        postsCount,
        commentsCount,
        likesCount,
        messagesInChats,
        chatsCount,
        newUsersCount,
        newPostsCount,
        newCommentsCount,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}
