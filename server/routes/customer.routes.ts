import express from 'express';
import { verifyToken, isCustomer } from '../middleware/auth.middleware';

const router = express.Router();

// Apply customer middleware to all routes
router.use(verifyToken, isCustomer);

// Profile management
router.get('/profile', (req, res) => {
  res.json({ message: 'Customer profile details' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Profile updated' });
});

// Orders
router.get('/orders', (req, res) => {
  res.json({ message: 'List of customer orders' });
});

router.get('/orders/:orderId', (req, res) => {
  res.json({ message: 'Order details' });
});

// Wishlist
router.get('/wishlist', (req, res) => {
  res.json({ message: 'Customer wishlist' });
});

router.post('/wishlist/:productId', (req, res) => {
  res.json({ message: 'Product added to wishlist' });
});

router.delete('/wishlist/:productId', (req, res) => {
  res.json({ message: 'Product removed from wishlist' });
});

// Reviews
router.post('/reviews/:productId', (req, res) => {
  res.json({ message: 'Review submitted' });
});

router.put('/reviews/:reviewId', (req, res) => {
  res.json({ message: 'Review updated' });
});

router.delete('/reviews/:reviewId', (req, res) => {
  res.json({ message: 'Review deleted' });
});

// Address management
router.get('/addresses', (req, res) => {
  res.json({ message: 'List of addresses' });
});

router.post('/addresses', (req, res) => {
  res.json({ message: 'Address added' });
});

router.put('/addresses/:addressId', (req, res) => {
  res.json({ message: 'Address updated' });
});

router.delete('/addresses/:addressId', (req, res) => {
  res.json({ message: 'Address deleted' });
});

export default router; 