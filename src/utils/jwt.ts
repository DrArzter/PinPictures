import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: number;
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
    const decoded = jwt.verify(token, secret!) as JwtPayload;

    decoded.userId = Number(decoded.userId);
    return decoded;
  } catch (error) {
    return null;
  }
};
