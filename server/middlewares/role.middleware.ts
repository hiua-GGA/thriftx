import { Response, NextFunction } from 'express';
import { RequestWithUser } from './auth.middleware';
import { UserRole } from '../models/User';

type CustomRequestHandler = (req: RequestWithUser, res: Response, next: NextFunction) => void;

export const checkRole = (roles: UserRole[]): CustomRequestHandler => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
}; 