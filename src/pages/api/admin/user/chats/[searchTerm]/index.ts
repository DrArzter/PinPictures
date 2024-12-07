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

    if (user.bananLevel < 1) {
      return res
        .status(403)
        .json({ status: "error", message: "Access denied" });
    }

    const searchTerm = req.query.searchTerm as string;

    const chats = await prisma.chats.findMany({
      where: {
        OR: [
          searchTerm && !isNaN(parseInt(searchTerm))
            ? {
                UsersInChats: {
                  some: {
                    User: {
                      id: parseInt(searchTerm),
                    },
                  },
                },
              }
            : null,
          searchTerm
            ? {
                UsersInChats: {
                  some: {
                    User: {
                      name: {
                        contains: searchTerm,
                      },
                    },
                  },
                },
              }
            : null,
          searchTerm
            ? {
                UsersInChats: {
                  some: {
                    User: {
                      email: {
                        contains: searchTerm,
                      },
                    },
                  },
                },
              }
            : null,
        ].filter(Boolean),
      },
      include: {
        UsersInChats: {
          include: {
            User: {
              select: {
                id: true,
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
