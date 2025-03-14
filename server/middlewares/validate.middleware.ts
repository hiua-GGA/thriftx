import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

type CustomRequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export const validateRequest: CustomRequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}; 