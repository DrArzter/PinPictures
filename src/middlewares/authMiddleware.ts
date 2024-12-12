// middlewares/authMiddleware.ts

import { verifyToken } from "@/utils/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { parse } from "cookie";
import { ClientSelfUser } from "@/app/types/global";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 10,
});

interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
}
interface CustomNextApiRequest extends NextApiRequest {
  user: ClientSelfUser | null;
}

export async function authMiddleware(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  return new Promise<void>(async (resolve, reject) => {
    const cookieStore = req.cookies || parse(req.headers.cookie || "");
    const token = cookieStore.token;

    if (!token) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return reject();
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      if (Date.now() >= decoded.exp * 1000) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return reject();
      }

      const userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(200).json({ status: "error", message: "Unauthorized" });
        return reject();
      }

      try {
        await rateLimiter.consume(user.id.toString());
      } catch {
        res.status(429).json({ status: "error", message: "Too many requests" });
        return reject();
      }

      const { ...userWithoutSensitiveInfo } = user;

      req.user = {
        ...userWithoutSensitiveInfo,
        settings: userWithoutSensitiveInfo.settings as Record<string, unknown>,
        Friendships_Friendships_user1IdToUser: [],
        Friendships_Friendships_user2IdToUser: [],
        friends: [],
      };

      if (user.banned) {
        res
          .status(444)
          .json({ status: "error", message: "User banned", data: user });
        return reject(new Error("User banned"));
      }
      resolve();
    } catch (err) {
      console.error("Authentication Error:", err);
      res.status(500).json({ status: "error", message: "Server error" });
      reject(err);
    }
  });
}
