import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { Prisma } from "@prisma/client";

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

    const orConditions: Prisma.UserWhereInput[] = [
      searchTerm && {
        name: {
          contains: searchTerm,
        },
      },
      searchTerm && {
        email: {
          contains: searchTerm,
        },
      },
      !isNaN(Number(searchTerm)) && {
        id: Number(searchTerm),
      },
    ].filter(Boolean) as Prisma.UserWhereInput[];

    const users = await prisma.user.findMany({
      where: {
        OR: orConditions,
      },
      include: {
        Comments: true,
      },
      take: 20, // Максимум 20 пользователей
    });

    return res
      .status(200)
      .json({ status: "success", message: "Users count", data: users });
  } catch (error) {
    handleError(res, error);
  }
}
