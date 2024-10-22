import { verifyToken } from '@/utils/jwt';
import { NextApiRequest, NextApiResponse } from 'next';
import  { prisma }  from '@/utils/prisma';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(req: any, res: NextApiResponse, next: () => void) {

  const cookieStore = req.cookies;
  const token = cookieStore.token;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    });

    
    const { password, bananaLevel, ...userWithoutSensitiveInfo } = user;

    req.user = userWithoutSensitiveInfo;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Server error' });
  }
}
