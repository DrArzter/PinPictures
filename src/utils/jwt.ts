// ./src/utils/jwt.ts
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const signToken = (user: any) => {
  const payload = { userId: user.id, name: user.name };
  const options = { expiresIn: "30d" };
  return jwt.sign(payload, secret!, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, secret!) as JwtPayload;
  } catch (error) {
    return null;
  }
};
