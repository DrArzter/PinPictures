import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { Comments } from "@prisma/client";
import { z } from "zod";

const commentSchema = z.object({
    comment: z.string().min(1, "Comment is required"),
  });
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  
        const { comment } = commentSchema.parse(req.body);
        const newComment = await prisma.comments.create({
          data: {
            comment: comment,
            userId: user.id,
            postId: postId,
          },
        });
  
        return res
          .status(200)
          .json({ status: "success", message: "Comment added successfully" });
      } catch (error) {
        return handleError(res, error);
      }
    });
  }
  