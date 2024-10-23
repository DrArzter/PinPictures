import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export const signToken = (user: any) => {
  const payload = { userId: user.id, name: user.name };
  const options = { expiresIn: '30d' };
  return jwt.sign(payload, secret!, options);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret!);
  } catch (error) {
    return null;
  }
};