import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { User } from "@/app/types/global"; // Assuming User is defined in types

export const config = {
  api: {
    bodyParser: true,
  },
};

// A type guard to check if user is not null
function isUser(user: User | null): user is User {
  return user !== null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  authMiddleware(req, res, async () => {
    const user = req.user;

    if (!isUser(user)) {
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
          userId: user.id,
        },
      });

      if (existingLike) {
        await prisma.likes.delete({ where: { id: existingLike.id } });
      } else {
        await prisma.likes.create({
          data: {
            postId,
            userId: user.id,
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
