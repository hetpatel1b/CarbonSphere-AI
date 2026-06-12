import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const OffsetProject = require('../src/models/OffsetProject');
const jwt = require('jsonwebtoken');

describe('Offset & Marketplace Endpoints', () => {
  let token;
  let userId;
  let project;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Offset User',
      email: 'offset@example.com',
      password: 'password123'
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    // Seed one offset project
    project = await OffsetProject.create({
      name: 'Amazon Rainforest Reforestation',
      description: 'Protects critical rainforest areas from logging.',
      category: 'Reforestation',
      costPerTon: 15.0,
      availableCredits: 1000,
      rating: 'Gold Standard',
      location: 'Brazil',
      capacity: 50000,
      image: 'amazon.png'
    });
  });

  describe('GET /api/offsets/projects', () => {
    it('should list all available offset projects', async () => {
      const res = await request(app)
        .get('/api/offsets/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name).toEqual('Amazon Rainforest Reforestation');
    });
  });

  describe('POST /api/offsets/purchase', () => {
    it('should successfully purchase carbon credits', async () => {
      const res = await request(app)
        .post('/api/offsets/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({
          projectId: project._id,
          credits: 10
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.credits).toEqual(10);
      expect(res.body.data.cost).toEqual(150.0);
    });

    it('should fail to purchase credits if quantity is negative', async () => {
      const res = await request(app)
        .post('/api/offsets/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({
          projectId: project._id,
          credits: -5
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toEqual(false);
    });
  });

  describe('GET /api/offsets/stats', () => {
    it('should retrieve overall offsetting statistics', async () => {
      const res = await request(app)
        .get('/api/offsets/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.totalCredits).toBeDefined();
    });
  });
});
