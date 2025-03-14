import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { OrderController } from '../controllers/order.controller';
import { UserRole } from '../models/User';

const router = Router();
const orderController = new OrderController();

// Validation rules
const createOrderValidation = [
  body('items').isArray().notEmpty().withMessage('Items are required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.street').isString().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').isString().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').isString().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').isString().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').isString().notEmpty().withMessage('Country is required'),
];

const updateShippingValidation = [
  param('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('shippingAddress').isObject().notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.street').isString().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').isString().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').isString().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').isString().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').isString().notEmpty().withMessage('Country is required'),
];

// Routes
router.post(
  '/',
  authenticate,
  createOrderValidation,
  validateRequest,
  orderController.createOrder
);

router.get(
  '/user',
  authenticate,
  orderController.getUserOrders
);

router.get(
  '/vendor',
  authenticate,
  checkRole([UserRole.VENDOR]),
  orderController.getVendorOrders
);

router.get(
  '/:orderId',
  authenticate,
  param('orderId').isMongoId().withMessage('Valid order ID is required'),
  validateRequest,
  orderController.getOrderById
);

router.put(
  '/:orderId/shipping',
  authenticate,
  updateShippingValidation,
  validateRequest,
  orderController.updateShippingDetails
);

router.get(
  '/:orderId/track',
  authenticate,
  param('orderId').isMongoId().withMessage('Valid order ID is required'),
  validateRequest,
  orderController.trackOrder
);

export default router; 