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

    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (req.method === "GET") {
      // Fetch the user with friendships
      const userWithFriends = await prisma.user.findUnique({
        where: { id: authenticatedUser.id },
        include: {
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

      if (!userWithFriends) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      const friendsAsUser1 = userWithFriends.Friendships_Friendships_user1IdToUser.map(
        (friendship) => ({
          friend: friendship.User_Friendships_user2IdToUser,
          status: friendship.status,
        })
      );

      const friendsAsUser2 = userWithFriends.Friendships_Friendships_user2IdToUser.map(
        (friendship) => ({
          friend: friendship.User_Friendships_user1IdToUser,
          status: friendship.status,
        })
      );

      const allFriends = [...friendsAsUser1, ...friendsAsUser2];

      // Construct the final user object with friends
      const userWithFriendsResponse = {
        ...userWithFriends,
        friends: allFriends,
      };

      delete userWithFriendsResponse.Friendships_Friendships_user1IdToUser;
      delete userWithFriendsResponse.Friendships_Friendships_user2IdToUser;

      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: userWithFriendsResponse,
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
          const image = Array.isArray(files.image) ? files.image[0] : files.image;
          if (!image) {
            return res.status(400).json({ error: "Image file is required" });
          }

          const fileTypes = /jpeg|jpg|png|gif|webp/;
          const originalFilename = image.originalFilename || "";
          const fileExt = originalFilename.split(".").pop()?.toLowerCase();

          if (!fileExt || !fileTypes.test(fileExt)) {
            return res.status(400).json({ error: "Wrong file type" });
          }

          const mimeTypeValid = fileTypes.test(image.mimetype || "");
          if (!mimeTypeValid) {
            return res.status(400).json({ error: "Wrong file type" });
          }

          const tempPath = image.filepath;
          const randomString = Math.random().toString(36).substr(2, 10);
          const newPath = `${tempPath}.${fileExt}`;

          await fs.rename(tempPath, newPath);

          const url = userWithFriends.uiBackground;
          const extractedPath = url.split("pinpictures/")[1];
          if (!extractedPath.includes("otherImages/background2")) {
            await deleteFiles([extractedPath]);
          }

          const fileContent = await fs.readFile(newPath);
          const uploadResult = await uploadFiles([
            {
              filename: `users/${userWithFriends.id}-${randomString}-${Date.now()}.${fileExt}`,
              content: fileContent,
              path: newPath,
            },
          ]);

          const updatedUser = await prisma.user.update({
            where: { id: userWithFriends.id },
            data: { uiBackground: uploadResult[0].Location },
          });

          return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            user: updatedUser,
          });
        } else if (type === "uiColorUpdate") {
          let hex = fields.hex;
          if (Array.isArray(hex)) {
            hex = hex[0];
          }

          if (!hex || typeof hex !== "string") {
            return res.status(400).json({ error: "Invalid hex value" });
          }

          const updatedUser = await prisma.user.update({
            where: { id: userWithFriends.id },
            data: {
              settings: {
                ...userWithFriends.settings,
                bgColor: hex,
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
