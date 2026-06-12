import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Simulator Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Simulator User',
      email: 'simulator@example.com',
      password: 'password123'
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  });

  describe('POST /api/simulator/run', () => {
    it('should successfully run a simulation scenario', async () => {
      const res = await request(app)
        .post('/api/simulator/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          scenarioId: 'solar_panels'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.scenarioType).toEqual('Install Solar Panels');
      expect(res.body.data.results.costEstimate).toEqual(15000);
      expect(res.body.data.results.aiInsights).toBeDefined();
    });

    it('should fail to run simulation with invalid scenario ID', async () => {
      const res = await request(app)
        .post('/api/simulator/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          scenarioId: 'invalid_scenario'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toEqual(false);
    });
  });

  describe('GET /api/simulator/history', () => {
    it('should fetch the list of simulation history', async () => {
      // Run one scenario first
      await request(app)
        .post('/api/simulator/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          scenarioId: 'solar_panels'
        });

      const res = await request(app)
        .get('/api/simulator/history')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
