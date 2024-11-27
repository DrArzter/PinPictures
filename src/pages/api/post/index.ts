// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { uploadFiles } from "@/utils/s3Module";
import { authMiddleware } from "@/middlewares/authMiddleware";
import formidable from "formidable";
import fs from "fs/promises";
import { handleError } from "@/utils/errorHandler";

// Отключаем встроенный парсер тела запроса
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "100mb",
  },
};

interface CustomNextApiRequest extends NextApiRequest {
  user?: any;
}

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

    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;

    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Name and description are required",
      });
    }

    const newPost = await prisma.post.create({
      data: {
        name,
        description,
        authorId: user.id,
      },
    });

    const newPostId = newPost.id;

    const filesToUpload: {
      filename: string;
      content: Buffer;
      path: string;
    }[] = [];

    for (const key of Object.keys(files)) {
      const fileArray = Array.isArray(files[key])
        ? files[key]
        : [files[key]];

      if (fileArray.length > 10) {
        return res.status(400).json({
          status: "error",
          message: "You can only upload up to 10 images",
        });
      }

      for (const image of fileArray) {
        const fileTypes = /jpeg|jpg|png|gif|webp/;
        const fileExt = image.originalFilename
          ? image.originalFilename.split(".").pop()?.toLowerCase()
          : null;
        const mimeType = fileTypes.test(image.mimetype || "");
        const extname = fileExt ? fileTypes.test(fileExt) : false;

        if (!mimeType || !extname || !fileExt) {
          return res.status(400).json({
            status: "error",
            message: "Wrong file type",
          });
        }

        const tempPath = image.filepath;
        const randomString = Math.random().toString(36).substr(2, 10);
        const newPath = `${tempPath}.${fileExt}`;

        try {
          await fs.rename(tempPath, newPath);

          const fileContent = await fs.readFile(newPath);

          filesToUpload.push({
            filename: `posts/${newPostId}-${randomString}-${Date.now()}.${fileExt}`,
            content: fileContent,
            path: newPath,
          });
        } catch (error) {
          return handleError(res, error);
        }
      }
    }

    if (filesToUpload.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid files to upload",
      });
    }

    const uploadResult = await uploadFiles(filesToUpload);

    await Promise.all(
      filesToUpload.map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error(`Failed to delete file ${file.path}:`, err);
        }
      })
    );

    for (const result of uploadResult) {
      await prisma.imageInPost.create({
        data: {
          postId: newPost.id,
          picpath: result.Location,
          bucketkey: result.Key,
        },
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: newPostId,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
