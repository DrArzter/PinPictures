import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Unsupported method' });
    }

    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limit = 40;
    const offset = (pageNumber - 1) * limit;

    try {

        const posts = await prisma.post.findMany({
            skip: offset,
            take: limit,
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
        return res.status(500).json({ message: 'Error retrieving posts', error: err });
    }
}
