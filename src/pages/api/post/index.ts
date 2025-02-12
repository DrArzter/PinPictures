import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { uploadFiles } from "@/utils/s3Module";
import { authMiddleware } from "@/middlewares/authMiddleware";
import formidable from "formidable";
import fs from "fs/promises";
import { handleError } from "@/utils/errorHandler";

// Magic numbers map for supported formats
const magicNumbers: Record<string, string> = {
  jpeg: "ffd8ff",
  jpg: "ffd8ff", // Same as jpeg
  png: "89504e47",
  gif: "47494638",
  webp: "52494646",
};

// Checking file content using magic numbers
async function isValidFileContent(
  buffer: Buffer,
  fileExt: string
): Promise<boolean> {
  const magicHex = buffer.slice(0, 4).toString("hex");
  const expectedMagic = magicNumbers[fileExt];
  return expectedMagic ? magicHex.startsWith(expectedMagic) : false;
}

// Disable built-in request body parser
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "100mb",
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Unsupported method" });
  }

  const tempFiles: string[] = [];

  try {
    await authMiddleware(req, res);
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const form = formidable({ multiples: true });

    // Parsing form data
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

    // Creating a new post
    const newPost = await prisma.post.create({
      data: {
        name,
        description,
        authorId: user.id,
      },
    });

    const newPostId = newPost.id;

    // Preparing files for upload
    const filesToUpload: {
      filename: string;
      content: Buffer;
      path: string;
    }[] = [];

    for (const key of Object.keys(files)) {
      const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];

      if (fileArray.length > 10) {
        return res.status(400).json({
          status: "error",
          message: "You can only upload up to 10 images",
        });
      }

      for (const image of fileArray) {
        if (!image) continue;

        tempFiles.push(image.filepath);

        const allowedExtensions = ["jpeg", "jpg", "png", "gif", "webp"];

        const fileExt = image.originalFilename?.split(".").pop()?.toLowerCase();

        if (!fileExt || !allowedExtensions.includes(fileExt)) {
          await prisma.post.delete({ where: { id: newPostId } });
          return res.status(400).json({
            status: "error",
            message: "Unsupported file type",
          });
        }

        // Reading first bytes of the file
        const buffer = await fs.readFile(image.filepath);

        if (!isValidFileContent(buffer, fileExt)) {
          await prisma.post.delete({ where: { id: newPostId } });
          return res.status(400).json({
            status: "error",
            message: "File content does not match the file extension",
          });
        }

        // Creating unique file path
        const tempPath = image.filepath;
        const randomString = Math.random().toString(36).substr(2, 10);
        const newPath = `${tempPath}.${fileExt}`;

        try {
          // Renaming and reading file
          await fs.rename(tempPath, newPath);

          const fileContent = await fs.readFile(newPath);

          filesToUpload.push({
            filename: `posts/${newPostId}-${randomString}-${Date.now()}.${fileExt}`,
            content: fileContent,
            path: newPath,
          });

          // Updating path in temporary files list
          tempFiles[tempFiles.indexOf(tempPath)] = newPath;
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

    // Uploading files to S3
    const uploadResult = await uploadFiles(filesToUpload);

    // Removing temporary files
    await cleanupFiles(tempFiles);

    // Saving uploaded images data to DB
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
  } finally {
    try {
      await cleanupFiles(tempFiles);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

// Cleanup function for temporary files
async function cleanupFiles(filePaths: string[]) {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Failed to delete file ${filePath}:`, err);
    }
  }
}
