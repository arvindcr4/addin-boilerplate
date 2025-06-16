import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from './utils/logger';

export interface Context {
  req: Request;
  user?: {
    id: string;
    email: string;
  };
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  // Get the user token from the headers
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.headers['x-auth-token'] as string;

  let user;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      user = {
        id: decoded.id,
        email: decoded.email,
      };
    } catch (error) {
      logger.debug('Invalid token:', error);
    }
  }

  return {
    req,
    user,
  };
}