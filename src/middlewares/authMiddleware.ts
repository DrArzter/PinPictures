import { verifyToken } from "@/utils/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { parse } from "cookie";
import { ClientSelfUser } from "@/app/types/global";

interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
}

interface CustomNextApiRequest extends NextApiRequest {
  user: ClientSelfUser | null;
  clientIp?: string;
}

export async function authMiddleware(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  return new Promise<void>(async (resolve, reject) => {
    // Определение IP
    const clientIp =
      req.socket.remoteAddress ||
      (req.headers["x-forwarded-for"] as string) ||
      "unknown";
    req.clientIp = clientIp;

    // LOG IP, route and method
    console.log(`IP: ${clientIp}, Route: ${req.url}, Method: ${req.method}`);

    const cookieStore = req.cookies || parse(req.headers.cookie || "");
    const token = cookieStore.token;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      if (!decoded) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      if (Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({
          status: "error",
          message: "Token expired",
        });
      }

      const userId = decoded.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "User not found",
        });
      }

      // Check rate limits
      // Turned off
      /*
      try {
        if (user) {
          await userRateLimiter.consume(user.id.toString());
        } else {
          await ipRateLimiter.consume(clientIp);
        }
      } catch (error) {
        return handleRateLimitError(error as RateLimiterRes, req, res);
      }
      */

      if (user.banned) {
        return res.status(444).json({
          status: "error",
          message: "User banned",
          data: user,
        });
      }

      const { ...userWithoutSensitiveInfo } = user;
      req.user = {
        ...userWithoutSensitiveInfo,
        settings: userWithoutSensitiveInfo.settings as Record<string, unknown>,
        Friendships_Friendships_user1IdToUser: [],
        Friendships_Friendships_user2IdToUser: [],
        friends: [],
      };

      resolve();
    } catch (err) {
      console.error("Authentication Error:", err);
      res.status(500).json({
        status: "error",
        message: "Server error",
      });
      reject(err);
    }
  });
}
