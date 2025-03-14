import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../middlewares/auth.middleware';
import { Order, IOrderDocument, IShippingAddress, OrderStatus, IOrderItem } from '../models/Order';
import { Product } from '../models/Product';
import { UserRole } from '../models/User';
import { Types } from 'mongoose';

type CustomRequestHandler = (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;

interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export class OrderController {
  createOrder: CustomRequestHandler = async (req, res, next) => {
    try {
      const { items, shippingAddress } = req.body as { items: CreateOrderItem[]; shippingAddress: IShippingAddress };
      const userId = req.user._id;

      // Validate products and calculate total
      const productIds = items.map(item => new Types.ObjectId(item.productId));
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== items.length) {
        res.status(400).json({ message: 'One or more products not found' });
        return;
      }

      const total = items.reduce((acc: number, item) => {
        const product = products.find(p => p._id.toString() === item.productId);
        if (!product) {
          throw new Error('Product not found');
        }
        return acc + (product.price * item.quantity);
      }, 0);

      const orderItems: IOrderItem[] = items.map(item => ({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity
      }));

      const order = await Order.create({
        userId,
        items: orderItems,
        shippingAddress,
        total,
        status: OrderStatus.PENDING
      });

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  getUserOrders: CustomRequestHandler = async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.productId');
      
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

  getVendorOrders: CustomRequestHandler = async (req, res, next) => {
    try {
      if (req.user.role !== UserRole.VENDOR) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      const orders = await Order.find({
        'items.productId': { $in: await Product.find({ vendorId: req.user._id }).select('_id') }
      })
        .sort({ createdAt: -1 })
        .populate('items.productId');

      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

  getOrderById: CustomRequestHandler = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId).populate('items.productId');
      
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      // Check if user has permission to view this order
      if (
        req.user.role !== UserRole.ADMIN &&
        order.userId.toString() !== req.user._id.toString() &&
        req.user.role !== UserRole.VENDOR
      ) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  updateShippingDetails: CustomRequestHandler = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const shippingAddress = req.body as IShippingAddress;

      const order = await Order.findById(orderId) as IOrderDocument;
      
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      // Check if user has permission to update this order
      if (order.userId.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      order.shippingAddress = shippingAddress;
      await order.save();

      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  trackOrder: CustomRequestHandler = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId) as IOrderDocument;
      
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      // Check if user has permission to track this order
      if (
        req.user.role !== UserRole.ADMIN &&
        order.userId.toString() !== req.user._id.toString() &&
        req.user.role !== UserRole.VENDOR
      ) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      res.json({
        orderId: order._id,
        status: order.status,
        updatedAt: order.updatedAt
      });
    } catch (error) {
      next(error);
    }
  };
}

// Create a new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod
    } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = await Promise.all(items.map(async (item: any) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const variant = product.variants.find(v => 
        v.size === item.variant.size && 
        v.color === item.variant.color
      );

      if (!variant) {
        throw new Error(`Variant not found for product: ${item.productId}`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.productId}`);
      }

      totalAmount += variant.price * item.quantity;

      return {
        product: product._id,
        variant: {
          size: variant.size,
          color: variant.color,
          price: variant.price,
          sku: variant.sku
        },
        quantity: item.quantity,
        price: variant.price
      };
    }));

    // Validate shipping address
    const addressValidation = await shippingService.validateAddress({
      name: shippingAddress.name,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.postalCode,
      country: shippingAddress.country,
      email: req.user.email
    });

    if (!addressValidation.isValid) {
      return res.status(400).json({
        message: 'Invalid shipping address',
        suggestions: addressValidation.suggestedAddress
      });
    }

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId: req.user._id,
      vendorId: items[0].vendorId, // Assuming single vendor order
      items: orderItems,
      totalAmount,
      shippingDetails: {
        address: shippingAddress,
        carrier: '',
        shippingCost: 0,
        shippingMethod: ''
      },
      paymentMethod,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order created'
      }],
      currentStatus: 'pending'
    });

    await order.save();

    // Get shipping rates
    const rates = await shippingService.getShippingRates(
      {
        name: 'Vendor Name', // Replace with actual vendor details
        street: 'Vendor Street',
        city: 'Vendor City',
        state: 'Vendor State',
        zip: 'Vendor Zip',
        country: 'Vendor Country',
        email: 'vendor@email.com'
      },
      {
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.postalCode,
        country: shippingAddress.country,
        email: req.user.email
      },
      {
        length: 10, // Replace with actual package dimensions
        width: 10,
        height: 10,
        weight: 2
      }
    );

    res.status(201).json({ 
      message: 'Order created successfully', 
      order,
      shippingRates: rates
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get orders for a user
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get orders for a vendor
export const getVendorOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ vendorId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product')
      .populate('userId', 'name email');
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor orders', error });
  }
};

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({
      _id: orderId,
      $or: [
        { userId: req.user._id },
        { vendorId: req.user._id }
      ]
    })
    .populate('items.product')
    .populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Update order shipping details
export const updateShipping = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { rateId, carrier, serviceName } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      vendorId: req.user._id,
      currentStatus: 'pending'
    });

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or cannot be updated' 
      });
    }

    // Create shipping label
    const shippingLabel = await shippingService.createShippingLabel(
      order,
      {
        name: 'Vendor Name', // Replace with actual vendor details
        street: 'Vendor Street',
        city: 'Vendor City',
        state: 'Vendor State',
        zip: 'Vendor Zip',
        country: 'Vendor Country',
        email: 'vendor@email.com'
      },
      {
        name: order.shippingDetails.address.name,
        street: order.shippingDetails.address.street,
        city: order.shippingDetails.address.city,
        state: order.shippingDetails.address.state,
        zip: order.shippingDetails.address.postalCode,
        country: order.shippingDetails.address.country,
        email: req.user.email
      },
      {
        length: 10, // Replace with actual package dimensions
        width: 10,
        height: 10,
        weight: 2
      }
    );

    // Update order shipping details
    order.shippingDetails = {
      ...order.shippingDetails,
      carrier,
      trackingNumber: shippingLabel.trackingNumber,
      trackingUrl: shippingLabel.trackingUrl,
      labelUrl: shippingLabel.labelUrl,
      rateId: rateId,
      estimatedDeliveryDate: new Date(Date.now() + (shippingLabel.estimatedDays * 24 * 60 * 60 * 1000)),
      shippingMethod: serviceName,
      shippingCost: shippingLabel.price
    };

    // Update status
    order.statusHistory.push({
      status: 'processing',
      timestamp: new Date(),
      note: 'Shipping label created'
    });
    order.currentStatus = 'processing';

    await order.save();

    res.json({ 
      message: 'Shipping details updated', 
      order 
    });
  } catch (error) {
    console.error('Error updating shipping:', error);
    res.status(500).json({ message: 'Error updating shipping', error });
  }
};

// Track order
export const trackOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      $or: [
        { userId: req.user._id },
        { vendorId: req.user._id }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.shippingDetails.trackingNumber || !order.shippingDetails.carrier) {
      return res.status(400).json({ 
        message: 'Tracking information not available' 
      });
    }

    const tracking = await shippingService.trackShipment(
      order.shippingDetails.trackingNumber,
      order.shippingDetails.carrier
    );

    // Update order status if needed
    if (tracking.status !== order.currentStatus) {
      order.statusHistory.push({
        status: tracking.status,
        timestamp: new Date(tracking.timestamp),
        note: tracking.statusDetails
      });
      order.currentStatus = tracking.status;
      await order.save();
    }

    res.json({ 
      tracking,
      order 
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ message: 'Error tracking order', error });
  }
};

// Helper function to generate unique order number
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
}; 