// pages/api/profile/[name].ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { parse } from "cookie";
import { handleError } from "@/utils/errorHandler";
import { verifyToken } from "@/utils/jwt";

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

  const cookieStore = req.cookies || parse(req.headers.cookie || "");
  const token = cookieStore.token;

  let authenticatedUserId: number | null = null;

  if (token) {
    try {
      const decoded = verifyToken(token);

      if (Date.now() >= decoded.exp * 1000) {
        authenticatedUserId = null;
      } else {
        authenticatedUserId = decoded.userId;
      }
    } catch (error) {
      authenticatedUserId = null;
    }
  }

  try {
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Profile name is required" });
    }
    const profile = await prisma.user.findUnique({
      where: {
        name: name as string,
      },
      select: {
        id: true,
        avatar: true,
        background: true,
        lastLoginAt: true,
        description: true,
        name: true,
        Post: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            ImageInPost: {
              select: {
                id: true,
                picpath: true,
              },
            },
            Likes: {
              select: {
                userId: true,
              },
            },
            User: {
              select: {
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                Likes: true,
                Comments: true,
              },
            },
          },
        },
        Friendships_Friendships_user1IdToUser: {
          select: {
            status: true,
            User_Friendships_user2IdToUser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        Friendships_Friendships_user2IdToUser: {
          select: {
            status: true,
            User_Friendships_user1IdToUser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return res
        .status(404)
        .json({ status: "error", message: "Profile not found" });
    }

    if (authenticatedUserId) {
      const isBlocked = await prisma.friendships.findFirst({
        where: {
          user1Id: authenticatedUserId,
          user2Id: profile.id,
          status: "blocked",
        },
      });

      if (isBlocked) {
        return res.status(200).json({
          data: "blocked",
          status: "success",
          message: "Profile is blocked",
        });
      }
    }

    const friendsAsUser1 = profile.Friendships_Friendships_user1IdToUser.map(
      (friendship) => ({
        friend: friendship.User_Friendships_user2IdToUser,
        status: friendship.status,
      })
    );

    const friendsAsUser2 = profile.Friendships_Friendships_user2IdToUser.map(
      (friendship) => ({
        friend: friendship.User_Friendships_user1IdToUser,
        status: friendship.status,
      })
    );

    const allFriends = [...friendsAsUser1, ...friendsAsUser2];

    const profileWithFriends = {
      ...profile,
      friends: allFriends,
    };

    delete profileWithFriends.Friendships_Friendships_user1IdToUser;
    delete profileWithFriends.Friendships_Friendships_user2IdToUser;

    return res.status(200).json({
      data: profileWithFriends,
      status: "success",
      message: "Profile retrieved successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
}
