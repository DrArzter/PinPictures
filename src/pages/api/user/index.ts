import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { verifyToken } from '@/utils/jwt';
import { stat } from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== 'GET') {
        return res.status(405).json({type: 'error', message: 'Idi nahuy' });
    }

    const cookieStore = req.cookies;
    const token = cookieStore.token;
    
    if (!token) {
        return res.status(401).json({ 
            type: 'error',
            status: 'error',
            message: 'Token not found' });
    }

    try {
        const { userId } = verifyToken(token) as { userId: number };
        prisma.user.findUnique({ where: { id: userId } }).then((user) => {
            if (!user) {
                return res.status(401).json({ type: 'error', message: 'Пользователь не найден' });
            }
            const { password, bananaLevel, ...userWithoutSensitiveInfo } = user;
            return res.status(200).json({
                data: userWithoutSensitiveInfo, 
                status: 'success', 
                message: 'User retrieved successfully'
              });
        })
    } catch (error) {
        return res.status(401).json({ 
            type: 'error', 
            status: 'error', 
            message: 'Invalid token' 
          });
          
    }
}