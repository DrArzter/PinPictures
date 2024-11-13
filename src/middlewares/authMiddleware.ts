import { verifyToken } from "@/utils/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

interface DecodedToken {
  userId: number; // Преобразуем в число, если это число в базе данных
  iat: number;
  exp: number;
}

export async function authMiddleware(
  req: any,
  res: NextApiResponse,
  next: () => void
) {
  const cookieStore = req.cookies;
  const token = cookieStore.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken;

    if (!decoded) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token" });
    }

    // Преобразуем userId в число, если это необходимо
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const { password, bananaLevel, ...userWithoutSensitiveInfo } = user;

    req.user = userWithoutSensitiveInfo;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Server error" });
  }
}
