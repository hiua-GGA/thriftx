import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Apply admin middleware to all routes
router.use(verifyToken, isAdmin);

// Admin dashboard statistics
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard data' });
});

// User management
router.get('/users', (req, res) => {
  res.json({ message: 'List of all users' });
});

router.put('/users/:userId/status', (req, res) => {
  res.json({ message: 'User status updated' });
});

// Vendor management
router.get('/vendors/pending', (req, res) => {
  res.json({ message: 'List of pending vendor verifications' });
});

router.put('/vendors/:vendorId/verify', (req, res) => {
  res.json({ message: 'Vendor verified' });
});

// Product management
router.get('/products/reported', (req, res) => {
  res.json({ message: 'List of reported products' });
});

router.put('/products/:productId/status', (req, res) => {
  res.json({ message: 'Product status updated' });
});

export default router; 