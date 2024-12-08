// middlewares/authMiddleware.ts

import { verifyToken } from "@/utils/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { parse } from "cookie";
import { clientSelfUser } from "@/app/types/global";

interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
}
interface CustomNextApiRequest extends NextApiRequest {
  user: clientSelfUser | null;
}

export async function authMiddleware(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  return new Promise<void>(async (resolve, reject) => {
    const cookieStore = req.cookies || parse(req.headers.cookie || "");
    const token = cookieStore.token;

    if (!token) {
      res.status(401).json({ status: "error", message: "No token provided" });
      return reject(new Error("No token provided"));
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      if (Date.now() >= decoded.exp * 1000) {
        res.status(401).json({ status: "error", message: "Token expired" });
        return reject(new Error("Token expired"));
      }

      const userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ status: "error", message: "User not found" });
        return reject(new Error("User not found"));
      }

      const { password, ...userWithoutSensitiveInfo } = user;

      req.user = {
        ...userWithoutSensitiveInfo,
        Friendships_Friendships_user1IdToUser: [],
        Friendships_Friendships_user2IdToUser: [],
        password: ''
      };

      if (user.banned) {
        res.status(444).json({ status: "error", message: "User banned", data: user });
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
