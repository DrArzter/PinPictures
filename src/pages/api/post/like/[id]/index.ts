import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  authMiddleware(req, res, async () => {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    try {
      const postId = parseInt(req.query.id as string, 10);
      if (isNaN(postId)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid post ID" });
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { likes: true },
      });

      if (!post) {
        return res
          .status(404)
          .json({ status: "error", message: "Post not found" });
      }

      const existingLike = await prisma.likes.findFirst({
        where: {
          postId,
          userId: req.user.id,
        },
      });

      if (existingLike) {
        await prisma.likes.delete({ where: { id: existingLike.id } });
      } else {
        await prisma.likes.create({
          data: {
            postId,
            userId: req.user.id,
          },
        });
      }

      return res
        .status(200)
        .json({ status: "success", message: "Like updated successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  });
}
