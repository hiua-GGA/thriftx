import mongoose from 'mongoose';
import { Order, IOrderDocument, OrderStatus } from '../../models/Order';

describe('Order Model', () => {
  // Test data
  const validOrderData = {
    user: new mongoose.Types.ObjectId(),
    items: [
      {
        product: new mongoose.Types.ObjectId(),
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
  };

  it('should create a valid order', async () => {
    const order = new Order(validOrderData);
    const savedOrder = await order.save();
    
    // Check if the order was saved correctly
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.user.toString()).toBe(validOrderData.user.toString());
    expect(savedOrder.items.length).toBe(1);
    expect(savedOrder.total).toBe(validOrderData.total);
    expect(savedOrder.status).toBe(OrderStatus.PENDING);
    expect(savedOrder.createdAt).toBeDefined();
    expect(savedOrder.updatedAt).toBeDefined();
  });

  it('should fail validation when required fields are missing', async () => {
    const orderWithoutUser = new Order({
      ...validOrderData,
      user: undefined,
    });

    await expect(orderWithoutUser.save()).rejects.toThrow();

    const orderWithoutItems = new Order({
      ...validOrderData,
      items: undefined,
    });

    await expect(orderWithoutItems.save()).rejects.toThrow();
  });

  it('should fail validation when total is negative', async () => {
    const orderWithNegativeTotal = new Order({
      ...validOrderData,
      total: -10,
    });

    await expect(orderWithNegativeTotal.save()).rejects.toThrow();
  });

  it('should update order status correctly', async () => {
    const order = new Order(validOrderData);
    await order.save();
    
    // Update status to SHIPPED
    order.status = OrderStatus.SHIPPED;
    const updatedOrder = await order.save();
    
    expect(updatedOrder.status).toBe(OrderStatus.SHIPPED);
  });

  it('should calculate total correctly from items', async () => {
    const orderData = {
      ...validOrderData,
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 2,
          price: 25.50,
        },
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 15.75,
        },
      ],
      // We'll let the model calculate the total
      total: 0,
    };

    const order = new Order(orderData);
    
    // If there's a pre-save hook that calculates the total
    const savedOrder = await order.save();
    
    // Expected total: (2 * 25.50) + (1 * 15.75) = 51.00 + 15.75 = 66.75
    expect(savedOrder.total).toBe(66.75);
  });
}); 