import jwt, { JwtPayload } from 'jsonwebtoken';

const getSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
};

const getTempSecret = (): string => {
  return process.env.JWT_TEMP_SECRET || getSecret();
};

export const signToken = (payload: object): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: '7d',
  });
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: '30m' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};

export const signTempToken = (payload: object): string => {
  return jwt.sign(payload, getTempSecret(), {
    expiresIn: '1h',
  });
};

export const verifyTempToken = (token: string): JwtPayload => {
  return jwt.verify(token, getTempSecret()) as JwtPayload;
};
