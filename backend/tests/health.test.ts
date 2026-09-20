import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('GET /api/health', () => {
  it('should return 200 OK with system health status payload', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'online');
    expect(res.body).toHaveProperty('service', 'OSMIUM Backend REST API');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toContain('Resource Not Found');
  });
});
