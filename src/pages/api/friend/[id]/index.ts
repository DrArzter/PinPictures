import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { Friendships_status } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    await authMiddleware(req, res);
    const currentUser = req.user;

    const { friendId, friendName } = req.body;

    if (!friendId || isNaN(friendId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or missing friend ID" });
    }

    if (!friendName || typeof friendName !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or missing friend name" });
    }

    if (currentUser.id === friendId) {
      return res
        .status(400)
        .json({ success: false, error: "You cannot add yourself as a friend" });
    }

    const existingFriendship = await prisma.friendships.findFirst({
      where: {
        OR: [
          { user1Id: currentUser.id, user2Id: friendId },
          { user1Id: friendId, user2Id: currentUser.id },
        ],
      },
    });

    if (existingFriendship) {
      if (
        existingFriendship.status === Friendships_status.pending &&
        existingFriendship.user2Id === currentUser.id
      ) {
        const updatedFriendship = await prisma.friendships.update({
          where: { id: existingFriendship.id },
          data: { status: Friendships_status.confirmed },
        });

        global.io.to(`user_${currentUser.id}`).emit("notification", {
          status: "success",
          message: `You are now friends with ${friendName}!`,
          link_to: `/profile/${friendName}`,
          clickable: true,
          time: 5000,
        });

        global.io.to(`user_${friendId}`).emit("notification", {
          status: "success",
          message: `${currentUser.name} accepted your friend request!`,
          link_to: `/profile/${currentUser.name}`,
          clickable: true,
          time: 5000,
        });

        return res
          .status(200)
          .json({ success: true, friendship: updatedFriendship });
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "You are already friends or cannot confirm this request.",
        });
    }

    const newFriendship = await prisma.friendships.create({
      data: {
        user1Id: currentUser.id,
        user2Id: friendId,
        status: Friendships_status.pending,
      },
    });

    global.io.to(`user_${friendId}`).emit("notification", {
      status: "info",
      message: `${currentUser.name} sent you a friend request!`,
      time: 5000,
      clickable: true,
      link_to: `/profile/${currentUser.name}`,
    });

    return res.status(201).json({ success: true, friendship: newFriendship });
  } catch (error) {
    console.error("Error handling friend request:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
