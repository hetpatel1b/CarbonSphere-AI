import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Settings Endpoints', () => {
  let token;
  let userId;
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Settings User',
      email: 'settings@example.com',
      password: 'password123',
      location: 'New York',
      timezone: 'EST'
    });
    userId = testUser._id;
    token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  });

  describe('GET /api/settings/profile', () => {
    it('should retrieve the user profile successfully', async () => {
      const res = await request(app)
        .get('/api/settings/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.email).toEqual('settings@example.com');
      expect(res.body.data.location).toEqual('New York');
    });
  });

  describe('PUT /api/settings/profile', () => {
    it('should update user profile details', async () => {
      const res = await request(app)
        .put('/api/settings/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          location: 'San Francisco',
          timezone: 'PST'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.name).toEqual('Updated Name');
      expect(res.body.data.location).toEqual('San Francisco');
    });
  });

  describe('PUT /api/settings/preferences', () => {
    it('should update user preference configurations', async () => {
      const res = await request(app)
        .put('/api/settings/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          goal: 'reduction',
          darkMode: false
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.goal).toEqual('reduction');
      expect(res.body.data.darkMode).toEqual(false);
    });
  });

  describe('PUT /api/settings/notifications', () => {
    it('should update notifications settings', async () => {
      const res = await request(app)
        .put('/api/settings/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          weeklyReports: false,
          aiInsights: true
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.weeklyReports).toEqual(false);
      expect(res.body.data.aiInsights).toEqual(true);
    });
  });

  describe('GET /api/settings/export', () => {
    it('should export all user profile and logs data', async () => {
      const res = await request(app)
        .get('/api/settings/export')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.profile).toBeDefined();
      expect(Array.isArray(res.body.data.activities)).toBe(true);
    });
  });
});
