import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { authMiddleware } from '@/middlewares/authMiddleware';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== 'GET') {
        return res.status(405).json({ type: 'error', message: 'Method not allowed' });
    }

    authMiddleware(req, res, async () => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(404).json({status: 'error', message: 'User not found' });
            }

            res.status(200).json({status: 'success', message: 'User retrieved successfully', data: user});
        } catch (error) {
            return res.status(500).json({status: 'error', message: 'Internal server error' });
        }
    });
}
