// pages/api/logout.ts

import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler";
import { clientSelfUser } from "@/app/types/global";

interface CustomNextApiRequest extends NextApiRequest {
  user: clientSelfUser | null;
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  try {
    await authMiddleware(req, res);

    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.setHeader("Set-Cookie", [
      `token=; Path=/; HttpOnly; SameSite=lax; Max-Age=0;${
        process.env.NODE_ENV === "production" ? " Secure;" : ""
      }`,
    ]);

    return res
      .status(200)
      .json({ status: "success", message: "Logout successful" });
  } catch (error) {
    if (!res.headersSent) {
      return handleError(res, error);
    }
  }
}
