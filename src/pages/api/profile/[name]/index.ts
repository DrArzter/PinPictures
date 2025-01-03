import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";

import { Friend } from "@/app/types/global";
import { userMiddleware } from "@/middlewares/userMiddleware";

interface ProfileWithFriends {
  id: number;
  name: string;
  description: string | null;
  lastLoginAt: Date;
  avatar: string;
  background: string;
  Post: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    Likes: { userId: number }[];
    _count: { Comments: number; Likes: number };
    ImageInPost: { id: number; picpath: string }[];
    User: { name: string; avatar: string };
  }[];
  friends: {
    friend: Friend;
    status: string;
  }[];
}

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

  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ status: "error", message: "Profile name is required" });
  }

  await userMiddleware(req);
  const authenticatedUserId = req.user?.id;

  try {
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

    const friendsAsUser1 =
      profile.Friendships_Friendships_user1IdToUser?.map((friendship) => ({
        friend: {
          id: friendship.User_Friendships_user2IdToUser.id,
          name: friendship.User_Friendships_user2IdToUser.name,
          avatar: friendship.User_Friendships_user2IdToUser.avatar,
        } as unknown as Friend,
        status: friendship.status as unknown as string, // Force cast if necessary
      })) || [];

    const friendsAsUser2 =
      profile.Friendships_Friendships_user2IdToUser?.map((friendship) => ({
        friend: {
          id: friendship.User_Friendships_user1IdToUser.id,
          name: friendship.User_Friendships_user1IdToUser.name,
          avatar: friendship.User_Friendships_user1IdToUser.avatar,
        } as unknown as Friend,
        status: String(friendship.status), // Cast to string
      })) || [];

    const allFriends = [...friendsAsUser1, ...friendsAsUser2];

    const profileWithFriends: ProfileWithFriends = {
      ...profile,
      friends: allFriends,
    };

    return res.status(200).json({
      data: profileWithFriends,
      status: "success",
      message: "Profile retrieved successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
}
