import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUserDocument;
}

interface JwtPayload {
  id: string;
  role?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if ((req as any).cookies && (req as any).cookies.jwt) {
    token = (req as any).cookies.jwt;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized — No authentication token provided'));
  }

  try {
    const secret = process.env.JWT_SECRET || 'osmium_dev_jwt_secret_min32chars_key_2026';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      return next(new Error('Not authorized — User account no longer exists'));
    }

    if (!user.isActive) {
      res.status(403);
      return next(new Error('Account disabled — Please contact support'));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized — Token verification failed or expired'));
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  return next(new Error('Forbidden — Administrative authorization required'));
};
