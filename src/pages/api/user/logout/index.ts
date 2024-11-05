import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { handleError } from "@/utils/errorHandler"; // Импорт обработчика ошибок

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  authMiddleware(req, res, async () => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      res.setHeader("Set-Cookie", [
        `token=; SameSite=lax; HttpOnly; Path=/; Max-Age=0;` +
          (process.env.NODE_ENV === "production" ? " Secure;" : ""),
      ]);

      return res
        .status(200)
        .json({ status: "success", message: "Logout successful" });
    } catch (error) {
      return handleError(res, error);
    }
  });
}
