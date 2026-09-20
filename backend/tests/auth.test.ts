import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { generateToken } from '../utils/generateToken.js';
import { registerSchema, loginSchema, validateAuthInput } from '../validators/authValidator.js';

describe('Authentication & Authorization Suite', () => {
  it('should validate registration input with Zod', () => {
    const invalidResult = validateAuthInput(registerSchema, {
      name: 'A',
      email: 'not-an-email',
      password: '123',
    });

    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toHaveProperty('name');
    expect(invalidResult.errors).toHaveProperty('email');
    expect(invalidResult.errors).toHaveProperty('password');

    const validResult = validateAuthInput(registerSchema, {
      name: 'Enoch Abolude',
      email: 'enoch@example.com',
      password: 'SecurePassword123!',
    });

    expect(validResult.isValid).toBe(true);
  });

  it('should generate a valid JWT token', () => {
    const token = generateToken('mock_user_id_123', 'customer');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });

  it('should return 401 Unauthorized when accessing protected /api/auth/me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toContain('Not authorized');
  });
});
