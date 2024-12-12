import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { userMiddleware } from "@/middlewares/userMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  await userMiddleware(req);
  const authenticatedUser = req.user;

  const { page } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const limit = 20;
  const offset = (pageNumber - 1) * limit;

  try {
    const likedPostIds = authenticatedUser
      ? await prisma.likes
          .findMany({
            where: { userId: authenticatedUser.id },
            select: { postId: true },
          })
          .then((likes: { postId: number }[]) =>
            likes.map((like: { postId: number }) => like.postId)
          )
      : [];

    const posts = await prisma.post.findMany({
      skip: offset,
      take: limit,
      where: { User: { banned: false } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
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
        _count: {
          select: {
            Comments: true,
            Likes: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      isLiked: authenticatedUser ? likedPostIds.includes(post.id) : false,
    }));

    return res.status(200).json({
      data: formattedPosts,
      status: "success",
      message: "Posts retrieved successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
}
