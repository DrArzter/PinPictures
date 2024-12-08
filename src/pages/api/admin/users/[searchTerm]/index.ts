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

    const searchTerm = req.query.searchTerm as string;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
          {
            email: {
              contains: searchTerm,
            },
          },
          !isNaN(parseInt(searchTerm, 10)) && {
            id: parseInt(searchTerm, 10),
          },
        ].filter(Boolean) as any[],
      },
      include: {
        Comments: true,
      },
      take: 20,
    });

    return res
      .status(200)
      .json({ status: "success", message: "Users count", data: users });
  } catch (error) {
    handleError(res, error);
  }
}
