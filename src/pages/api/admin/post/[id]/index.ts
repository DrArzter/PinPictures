import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/errorHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { deleteFiles } from "@/utils/s3Module";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ status: "error", message: "Метод не поддерживается" });
  }

  try {
    await authMiddleware(req, res);
    const user = req.user;
    
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Пользователь не найден" });
    }

    if (user.bananaLevel < 1) {
      return res
        .status(403)
        .json({ status: "error", message: "Доступ запрещен" });
    }

    const postId = parseInt(req.query.id as string);
    
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Неверный ID поста" });
    }

    // Получаем пост и связанные изображения
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        ImageInPost: true
      }
    });

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Пост не найден" });
    }

    // Собираем ключи изображений для удаления из S3
    const imageKeys = post.ImageInPost.map(image => image.bucketkey);

    // Удаляем изображения из S3
    if (imageKeys.length > 0) {
      await deleteFiles(imageKeys);
    }

    // Удаляем пост (каскадно удалятся все связанные записи благодаря onDelete: Cascade)
    await prisma.post.delete({
      where: { id: postId }
    });

    return res
      .status(200)
      .json({ status: "success", message: "Пост успешно удален" });

  } catch (error) {
    return handleError(res, error);
  }
} 