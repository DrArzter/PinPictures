import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { deleteFiles } from "@/utils/s3Module";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ status: "error", message: "Method not supported" });
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
    
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid post ID" });
    }

    // Get post and related images
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        ImageInPost: true
      }
    });

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Collect image keys for deletion from S3
    const imageKeys = post.ImageInPost.map(image => image.bucketkey);

    // Delete images from S3
    if (imageKeys.length > 0) {
      await deleteFiles(imageKeys);
    }

    // Delete post (all related records will be deleted cascadingly thanks to onDelete: Cascade)
    await prisma.post.delete({
      where: { id: postId }
    });

    return res
      .status(200)
      .json({ status: "success", message: "Post successfully deleted" });

  } catch (error) {
    return handleError(res, error);
  }
} 