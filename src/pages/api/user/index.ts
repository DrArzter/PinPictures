// pages/api/user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { uploadFiles, deleteFiles } from "@/utils/s3Module";
import { authMiddleware } from "@/middlewares/authMiddleware";
import formidable from "formidable";
import fs from "fs/promises";
import { handleError } from "@/utils/errorHandler";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "25mb",
  },
};

interface CustomNextApiRequest extends NextApiRequest {
  user?: any;
}

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "PATCH") {
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

    if (req.method === "GET") {
      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } else if (req.method === "PATCH") {
      const form = formidable({ multiples: true });

      const { fields, files } = await new Promise<{
        fields: any;
        files: any;
      }>((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      const type = fields.type ? fields.type[0] : null;
      if (!type) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing type field" });
      }

      try {
        if (type === "uiBgUpdate") {
          const image = files.image[0];
          const fileTypes = /jpeg|jpg|png|gif|webp/;
          const fileExt = image.originalFilename.split(".").pop();
          const mimeType = fileTypes.test(image.mimetype);
          const extname = fileTypes.test(fileExt.toLowerCase());

          if (!mimeType || !extname) {
            return res.status(400).json({ error: "Wrong file type" });
          }

          const tempPath = image.filepath;
          const randomString = Math.random().toString(36).substr(2, 10);
          const newPath = `${tempPath}.${fileExt}`;

          await fs.rename(tempPath, newPath);

          const url = user.uiBackground;
          const extractedPath = url.split("pinpictures/")[1];
          if (!extractedPath.includes("otherImages/background2")) {
            await deleteFiles([extractedPath]);
          }

          const fileContent = await fs.readFile(newPath);
          const uploadResult = await uploadFiles([
            {
              filename: `users/${
                user.id
              }-${randomString}-${Date.now()}.${fileExt}`,
              content: fileContent,
              path: newPath,
            },
          ]);

          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { uiBackground: uploadResult[0].Location },
          });

          return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            user: updatedUser,
          });
        } else if (type === "uiColorUpdate") {
          let { hex } = fields;

          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              settings: {
                ...user.settings,
                bgColor: `${hex[0]}`,
              },
            },
          });

          return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            user: updatedUser,
          });
        } else {
          return res
            .status(400)
            .json({ status: "error", message: "Invalid type field" });
        }
      } catch (error) {
        return handleError(res, error);
      }
    }
  } catch (error) {
    return handleError(res, error);
  }
}
