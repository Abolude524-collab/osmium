import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { createProductSchema, validateProductInput } from '../validators/productValidator.js';

describe('Product API Test Suite', () => {
  it('should validate Zod product creation input', () => {
    const invalidResult = validateProductInput(createProductSchema, {
      name: 'Ab',
      sku: 'SKU',
      price: -10,
    });

    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toHaveProperty('name');
    expect(invalidResult.errors).toHaveProperty('price');
    expect(invalidResult.errors).toHaveProperty('category');
  });

  it('should reject unauthorized POST /api/products request without token', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Unauthorized Headphones',
      sku: 'OSM-TEST-99',
      price: 199,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toContain('Not authorized');
  });
});
