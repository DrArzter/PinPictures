import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  const { page } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const limit = 20;
  const offset = (pageNumber - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      skip: offset,
      take: limit,
      where: { User: { banned: false } },
      orderBy: { createdAt: "desc" },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        ImageInPost: {
          select: {
            id: true,
            picpath: true,
          },
        },

        //TODO: Вместо возврата всех пользователей, вернуть только нашего, если он авторизован
        Likes: {
          select: {
            userId: true,
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
    

    const totalPosts = await prisma.post.count();

    return res.status(200).json({
      posts,
      meta: {
        page: pageNumber,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
      status: "success",
      message: "Posts retrieved successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
}
