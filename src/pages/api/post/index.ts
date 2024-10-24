import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { uploadFiles } from '@/utils/s3Module';
import { authMiddleware } from '@/middlewares/authMiddleware';
import formidable from 'formidable';
import fs from 'fs/promises';
import { handleError } from '@/utils/errorHandler'; // Импорт функции для обработки ошибок

export const config = {
    api: {
        bodyParser: false,
        sizeLimit: '100mb',
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Unsupported method' });
    }

    authMiddleware(req, res, async () => {
        const form = formidable({ multiples: true });
        const user = req.user;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return handleError(res, err);
            }

            try {
                const post = {
                    name: fields.name[0],
                    description: fields.description[0],
                    authorId: user.id,
                };
                const newPost = await prisma.post.create({ data: post });
                const newPostId = newPost.id;

                const filesToUpload = [];

                for (const key of Object.keys(files)) {
                    const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];

                    if (fileArray.length > 10) {
                        return res.status(400).json({ status: 'error', message: 'You can only upload up to 10 images' });
                    }

                    for (const image of fileArray) {
                        const fileTypes = /jpeg|jpg|png|gif|webp/;
                        const fileExt = image.originalFilename.split('.').pop();
                        const mimeType = fileTypes.test(image.mimetype);
                        const extname = fileTypes.test(fileExt.toLowerCase());

                        if (!mimeType || !extname) {
                            return res.status(400).json({ status: 'error', message: 'Wrong file type' });
                        }

                        const tempPath = image.filepath;
                        const randomString = Math.random().toString(36).substr(2, 10);
                        const newPath = `${tempPath}.${fileExt}`;

                        try {
                            await fs.rename(tempPath, newPath);
                        } catch (error) {
                            return handleError(res, error);
                        }

                        const fileContent = await fs.readFile(newPath);
                        filesToUpload.push({
                            filename: `posts/${newPostId}-${randomString}-${Date.now()}.${fileExt}`,
                            content: fileContent,
                            path: newPath,
                        });
                    }
                }

                if (filesToUpload.length === 0) {
                    return res.status(400).json({ status: 'error', message: 'No valid files to upload' });
                }

                const uploadResult = await uploadFiles(filesToUpload);
                await Promise.all(filesToUpload.map(async (file) => {
                    await fs.unlink(file.path);
                }));

                for (const result of uploadResult) {
                    await prisma.imageInPost.create({
                        data: {
                            postId: newPost.id,
                            picpath: result.Location,
                            bucketkey: result.Key,
                        },
                    });
                }

                res.status(201).json({ status: 'success', message: 'Post created successfully', newPost });
            } catch (error) {
                return handleError(res, error);
            }
        });
    });
}
