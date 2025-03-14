import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { User, UserRole } from '../models/User';
import speakeasy from 'speakeasy';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, authConfig.jwt.secret) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Requires admin role' });
  }
  next();
};

export const isVendor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.VENDOR) {
    return res.status(403).json({ message: 'Requires vendor role' });
  }

  if (!req.user?.vendor?.isVerified) {
    return res.status(403).json({ message: 'Vendor account not verified' });
  }
  next();
};

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.CUSTOMER) {
    return res.status(403).json({ message: 'Requires customer role' });
  }
  next();
};

export const isEmailVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isEmailVerified) {
    return res.status(403).json({ message: 'Email not verified' });
  }
  next();
}; 