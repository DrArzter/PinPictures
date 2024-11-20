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

  const { name } = req.query;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ status: "error", message: "No name provided" });
    }
    

    const friends = await prisma.user.findUnique({
      where: {
        name: name as string,
      },
      select: {
        friendships: true,
      },
    });


    if (!friends) {
      return res
        .status(404)
        .json({ status: "error", message: "Friends not found" });
    }

    return res.status(200).json({
      data: friends,
      status: "success",
      message: "Profile retrieved successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
}
