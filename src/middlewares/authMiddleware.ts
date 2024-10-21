import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: any, res: NextApiResponse, next: () => void) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}
