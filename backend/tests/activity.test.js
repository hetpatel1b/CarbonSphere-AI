import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Activity Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Activity User',
      email: 'activity@example.com',
      password: 'password123'
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  });

  describe('POST /api/activities', () => {
    it('should create an activity successfully', async () => {
      const res = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'Transport',
          activityType: 'Driving',
          carbonEmission: 12.5,
          date: new Date().toISOString()
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.category).toEqual('Transport');
      expect(res.body.data.activityType).toEqual('Driving');
    });

    it('should fail with invalid category', async () => {
      const res = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'InvalidCategory',
          activityType: 'Driving',
          carbonEmission: 12.5
        });
      
      expect(res.statusCode).toEqual(400); // Handled by Zod
    });
  });

  describe('GET /api/activities', () => {
    beforeEach(async () => {
      const Activity = require('../src/models/Activity');
      await Activity.create({
        userId,
        category: 'Food',
        activityType: 'Beef Meal',
        carbonEmission: 5,
        date: new Date()
      });
    });

    it('should fetch activities for user', async () => {
      const res = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].category).toEqual('Food');
    });
  });
});
