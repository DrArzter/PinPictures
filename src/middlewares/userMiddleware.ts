import { verifyToken } from "@/utils/jwt";
import { NextApiRequest } from "next";
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
}

export async function userMiddleware(req: CustomNextApiRequest) {
  return new Promise<void>(async (resolve) => {
    const cookieStore = req.cookies || parse(req.headers.cookie || "");
    const token = cookieStore.token || "";

    if (!token) {
      req.user = null;
      resolve();
      return;
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      if (Date.now() >= decoded.exp * 1000) {
        req.user = null;
        resolve();
        return;
      }

      const userId = decoded.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.banned) {
        req.user = null;
        resolve();
        return;
      }

      req.user = {
        ...user,
        settings: user.settings as Record<string, unknown>,
        Friendships_Friendships_user1IdToUser: [],
        Friendships_Friendships_user2IdToUser: [],
        friends: [],
      };

      resolve();
    } catch {
      req.user = null;
      resolve();
    }
  });
}
