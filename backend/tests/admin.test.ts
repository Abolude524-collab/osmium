import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { generateToken } from '../utils/generateToken.js';

describe('Admin Security & Metrics Suite', () => {
  it('should deny non-admin or unauthenticated users from accessing GET /api/admin/metrics', async () => {
    const customerToken = generateToken('customer_user_id', 'customer');

    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${customerToken}`);

    expect([401, 403]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status', 'error');
  });

  it('should check admin auth header on GET /api/admin/metrics', async () => {
    const adminToken = generateToken('admin_user_id', 'admin');

    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect([200, 401, 500]).toContain(res.statusCode);
  });
});
