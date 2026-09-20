import { describe, it, expect } from 'vitest';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';

describe('Data Models Validation Test Suite', () => {
  it('should invalidate User schema when email format is invalid', () => {
    const user = new User({
      name: 'Test User',
      email: 'invalid-email-format',
      password: 'short',
    });

    const err = user.validateSync();
    expect(err?.errors.email).toBeDefined();
    expect(err?.errors.password).toBeDefined();
  });

  it('should invalidate Product schema when price is negative', () => {
    const product = new Product({
      name: 'Test Product',
      slug: 'test-product',
      sku: 'TEST-SKU',
      description: 'A test description',
      price: -50,
      stock: 10,
    });

    const err = product.validateSync();
    expect(err?.errors.price).toBeDefined();
  });

  it('should validate Category schema correctly', () => {
    const category = new Category({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Devices and gadgets',
    });

    const err = category.validateSync();
    expect(err).toBeUndefined();
  });

  it('should invalidate Order schema when required order items are missing', () => {
    const order = new Order({
      orderNumber: 'OSM-TEST-01',
      subtotal: 100,
      totalAmount: 100,
    });

    const err = order.validateSync();
    expect(err?.errors.user).toBeDefined();
    expect(err?.errors['shippingAddress.fullName']).toBeDefined();
  });
});
