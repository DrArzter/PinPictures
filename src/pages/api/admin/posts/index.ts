import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
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

    const postId = parseInt(req.query.id as string);
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    console.log(post);

      

    return res
      .status(200)
      .json({ status: "success", message: "Post removed" });
  } catch (error) {
    handleError(res, error);
  }
}
