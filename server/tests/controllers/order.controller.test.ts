import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { User } from '../../models/User';
import { Product } from '../../models/Product';
import { generateToken } from '../../utils/auth';

describe('Order Controller', () => {
  let token: string;
  let userId: mongoose.Types.ObjectId;
  let productId: mongoose.Types.ObjectId;
  let orderId: mongoose.Types.ObjectId;

  // Setup test data before tests
  beforeAll(async () => {
    // Create a test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });
    await user.save();
    userId = user._id;

    // Generate JWT token for authentication
    token = generateToken(user);

    // Create a test product
    const product = new Product({
      name: 'Test Product',
      description: 'Test description',
      price: 29.99,
      category: 'clothing',
      inventory: 10,
      seller: userId,
    });
    await product.save();
    productId = product._id;

    // Create a test order
    const order = new Order({
      user: userId,
      items: [
        {
          product: productId,
          quantity: 2,
          price: 29.99,
        },
      ],
      total: 59.98,
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      status: OrderStatus.PENDING,
    });
    await order.save();
    orderId = order._id;
  });

  describe('GET /api/orders', () => {
    it('should return user orders when authenticated', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].user.toString()).toBe(userId.toString());
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return a specific order when authenticated', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(orderId.toString());
      expect(response.body.user.toString()).toBe(userId.toString());
      expect(response.body.items.length).toBe(1);
      expect(response.body.total).toBe(59.98);
    });

    it('should return 404 for non-existent order', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/orders/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order when authenticated', async () => {
      const orderData = {
        items: [
          {
            product: productId,
            quantity: 1,
            price: 29.99,
          },
        ],
        shippingAddress: {
          street: '456 Elm St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body._id).toBeDefined();
      expect(response.body.user.toString()).toBe(userId.toString());
      expect(response.body.items.length).toBe(1);
      expect(response.body.status).toBe(OrderStatus.PENDING);
    });

    it('should return 400 for invalid order data', async () => {
      const invalidOrderData = {
        // Missing required fields
        shippingAddress: {
          street: '456 Elm St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidOrderData);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should update order status when authenticated as admin', async () => {
      // Create an admin user
      const admin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
      await admin.save();
      const adminToken = generateToken(admin);

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: OrderStatus.SHIPPED });

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(orderId.toString());
      expect(response.body.status).toBe(OrderStatus.SHIPPED);
    });

    it('should return 403 when not authorized to update status', async () => {
      // Regular user cannot update order status
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: OrderStatus.DELIVERED });

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/orders/:id/shipping', () => {
    it('should update shipping address when authenticated as order owner', async () => {
      const newShippingAddress = {
        street: '789 Oak St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      };

      const response = await request(app)
        .put(`/api/orders/${orderId}/shipping`)
        .set('Authorization', `Bearer ${token}`)
        .send({ shippingAddress: newShippingAddress });

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(orderId.toString());
      expect(response.body.shippingAddress.street).toBe(newShippingAddress.street);
      expect(response.body.shippingAddress.city).toBe(newShippingAddress.city);
    });

    it('should return 403 when not the order owner', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
        role: 'user',
      });
      await anotherUser.save();
      const anotherToken = generateToken(anotherUser);

      const newShippingAddress = {
        street: '101 Pine St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA',
      };

      const response = await request(app)
        .put(`/api/orders/${orderId}/shipping`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ shippingAddress: newShippingAddress });

      expect(response.status).toBe(403);
    });
  });
}); 