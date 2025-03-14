import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, logout, getCurrentUser } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authConfig } from '../config/auth.config';
import { validateSignup, validateLogin, validateRequest } from '../middleware/validation.middleware';

const router = express.Router();

// Apply rate limiting to auth routes
const authLimiter = rateLimit(authConfig.rateLimit);

// Public routes
router.post('/signup', authLimiter, validateSignup, validateRequest, signup);
router.post('/login', authLimiter, validateLogin, validateRequest, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

export default router; 