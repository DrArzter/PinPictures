import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { verifyToken } from '@/utils/jwt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== 'GET') {
        return res.status(405).json({type: 'error', message: 'Idi nahuy' });
    }

    const cookieStore = req.cookies;
    const token = cookieStore.token;
    
    if (!token) {
        return res.status(401).json({ type: 'error', message: 'Токен не предоставлен' });
    }

    try {
        const { userId } = verifyToken(token) as { userId: number };
        prisma.user.findUnique({ where: { id: userId } }).then((user) => {
            if (!user) {
                return res.status(401).json({ type: 'error', message: 'Пользователь не найден' });
            }

            const { password, bananaLevel, ...userWithoutSensitiveInfo } = user;
            return res.status(200).json(userWithoutSensitiveInfo);
        })
        
    } catch (error) {
        return res.status(401).json({ type: 'error', message: 'Неверный токен' });
    }
}