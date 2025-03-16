// pages/api/post/id/[id]/index.ts
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

  const { term } = req.query;

  try {
    const Posts = await prisma.post.findMany({
      where: {
        OR: [
          { name: { contains: term as string } },
          { description: { contains: term as string } },
          { User: { name: { contains: term as string } } },
        ],
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        ImageInPost: true,
        Likes: true,
        _count: {
          select: { Comments: true },
        },
      },
    });

    const Users = await prisma.user.findMany({
      where: {
        name: {
          contains: term as string,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      data: {
        Posts,
        Users,
      },
      status: "success",
      message: "Search successful",
    });
  } catch (err) {
    return handleError(res, err);
  }
}
