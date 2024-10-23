import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { handleError } from '@/utils/errorHandler'; // Импорт функции для обработки ошибок

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: 'error', message: 'Unsupported method' });
    }

    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limit = 40;
    const offset = (pageNumber - 1) * limit;

    try {
        const posts = await prisma.post.findMany({
            skip: offset,
            take: limit,
            include: {
                images: true,
                likes: true,
                comments: true,
            },
        });

        const totalPosts = await prisma.post.count();

        return res.status(200).json({
            posts,
            meta: {
                page: pageNumber,
                limit,
                totalPosts,
                totalPages: Math.ceil(totalPosts / limit),
            },
            status: 'success',
            message: 'Posts retrieved successfully',
        });
    } catch (err) {
        return handleError(res, err);
    }
}
