import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { verifyToken } from '@/utils/jwt';
import { uploadFiles } from '@/utils/s3Module';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,  // Отключаем встроенный bodyParser для работы с formidable
        sizeLimit: '100mb',  // Увеличиваем лимит до 10MB (или другое значение, если нужно)
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Unsupported method' });
    }
    const form = formidable({ multiples: true });

    const userid = verifyToken(req.headers.authorization?.split(' ')[1])?.userId;
    console.log(userid);
    console.log(req.headers.authorization?.split(' ')[1]);
    console.log(verifyToken(req.headers.authorization?.split(' ')[1]));

    
    const post = {
        name: formData.name,
        description: formData.description,
        userid: formData.userid,
    };


    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error in file upload' });
        }


        const filesToCum = [];

        Object.keys(files).forEach(async (key) => {
            const fileArray = files[key];

            /*
                Я не уверен, что Object.keys.... выполнится лишь один раз
                Проверь проверку на кол-во файлов
                Убедись, что посты не создаются несколько раз
                Отправляй в ORM призмы нужные значения, сейчас я "натабал"
            */ 
            if (fileArray.length > 10) {
                return res.status(400).json({ status: 'error', message: 'You can only upload up to 10 images' });
            }
            const newPostId = await prisma.post.create({ data: post });


            if (!newPostId) {
                return res.status(500).json({ status: 'error', message: 'Failed to create post' });
            }

            fileArray.forEach(async (image) => {
                const filefffTypes = /jpeg|jpg|png|gif|webp/;
                const fileExt = image.originalname.split('.').pop();
                const mimeType = filefffTypes.test(image.mimetype);
                const extname = filefffTypes.test(fileExt.toLowerCase());

                if (!mimeType || !extname) {
                    return { error: "Wrong file type" };
                }
                const tempPath = image.path;
                const randomString = Math.random().toString(36).substr(2, 10);
                const newPath = `${tempPath}.${fileExt}`;

                try {
                    await fs.rename(tempPath, newPath);
                } catch (err) {
                    console.error(`Error renaming temporary file: ${tempPath}`, err);
                    return { error: "Server error" };
                }
                const fileContent = await fs.readFile(newPath);


                filesToCum.push({
                    filename: `posts/${newPostId}-${randomString}-${Date.now()}.${fileExt}`,
                    content: fileContent,
                    path: newPath
                });
            });
        });

        /*
            Всё-что ниже я вообще ctrl+c ctrl+v, не уверен, что работает
            filesToCum - аналог промиса в прошлой версии, туда записываются данные файлов в таком-же формате, что и в PP, но функция выше асинк, мб чёт развалится
        */

        for (let i = 0; i < filesToCum.length; i++) {
            if (filesToCum[i]['error']) {
                res.status(500).json({ status: 'error', message: filesToCum[i]['error'] });
                return;
            }
        }
        const res2 = await uploadFiles(filesToCum);
        await Promise.all(filesToCum.map(async (file) => {
            try {
                await fs.unlink(file.path);
            } catch (err) {
                console.error(`Error deleting temporary file: ${file.path}`, err);
                res.status(500).json({ status: 'error', message: 'Failed to upload some images' });
                return;
            }
        }));
        for (let i = 0; i < res2.length; i++) {
            await prisma.imagesInPosts.create({ postid: newPostId, picpath: res2[i].Location, bucketkey: res2[i].Key });
        }
        const newPost = await prisma.post.findUnique({ where: { id: newPostId } });
        res.status(201).json({ status: 'success', message: 'Post created successfully', newPost: newPost });

        res.status(200).json({ message: 'File uploaded successfully' });
    });


}