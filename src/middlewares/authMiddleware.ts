import { verifyToken } from '@/utils/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: any, res: NextApiResponse, next: () => void) {

  const cookieStore = req.cookies;
  const token = cookieStore.token;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Server error' });
  }
}
