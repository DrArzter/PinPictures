import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { authMiddleware } from '@/middlewares/authMiddleware';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== 'GET') {
        return res.status(405).json({ type: 'error', message: 'Method not allowed' });
    }

    authMiddleware(req, res, async () => {
        try {
            const userId = req.user.userId;

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!user) {
                return res.status(404).json({status: 'error', message: 'User not found' });
            }

            const { password, bananaLevel, ...userWithoutSensitiveInfo } = user;

            res.status(200).json({status: 'success', message: 'User retrieved successfully', data: userWithoutSensitiveInfo});
        } catch (error) {
            return res.status(500).json({status: 'error', message: 'Internal server error' });
        }
    });
}
