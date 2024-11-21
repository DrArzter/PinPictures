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
      .json({ status: "error", message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    // Parse and validate `id`
    const postId = parseInt(id as string, 10);
    if (!postId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID",
      });
    }

    // Fetch post with detailed related data
    const post = await prisma.post.findFirst({
      where: { id: postId },
      include: {
        User: {
          select: {
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
      post,
      status: "success",
      message: "Post retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching post:", err); // Log for server-side debugging
    return handleError(res, err);
  }
}
