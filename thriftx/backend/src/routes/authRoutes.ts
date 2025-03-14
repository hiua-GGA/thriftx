import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword
} from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

export default router; 