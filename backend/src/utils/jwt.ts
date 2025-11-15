import jwt, { JwtPayload } from 'jsonwebtoken';

const getSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
};

export const signToken = (payload: object): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};
