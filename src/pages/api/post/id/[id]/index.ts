// pages/api/post/id/[id]/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { handleError } from '@/utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Unsupported method' });
  }

  const { id } = req.query;

  try {
    const postId = parseInt(id as string, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid post ID' });
    }

    const post = await prisma.post.findFirst({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        images: true,
        likes: true,
        comments: {
          include: {
            author: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    return res.status(200).json({
      post,
      status: 'success',
      message: 'Post retrieved successfully',
    });
  } catch (err) {
    return handleError(res, err);
  }
}
