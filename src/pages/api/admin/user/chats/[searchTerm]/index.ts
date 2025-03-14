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

    // Типизация массива OR
    const orConditions: Prisma.ChatsWhereInput[] = [
      searchTerm &&
        !isNaN(parseInt(searchTerm)) && {
          UsersInChats: {
            some: {
              User: {
                id: parseInt(searchTerm),
              },
            },
          },
        },
      searchTerm && {
        UsersInChats: {
          some: {
            User: {
              name: {
                contains: searchTerm,
              },
            },
          },
        },
      },
      searchTerm && {
        UsersInChats: {
          some: {
            User: {
              email: {
                contains: searchTerm,
              },
            },
          },
        },
      },
    ].filter(Boolean) as Prisma.ChatsWhereInput[]; // ✅ Убрали any и заменили на тип Prisma.ChatsWhereInput

    const chats = await prisma.chats.findMany({
      where: {
        OR: orConditions,
      },
      include: {
        UsersInChats: {
          include: {
            User: {
              select: {
                id: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res
      .status(200)
      .json({ status: "success", message: "Chats", data: chats });
  } catch (error) {
    handleError(res, error);
  }
}
