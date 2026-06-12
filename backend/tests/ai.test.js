import { vi, describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

// Mock groqService
vi.mock('../src/services/groqService', () => ({
  generateAICoachInsights: vi.fn().mockResolvedValue({
    message: 'Mocked AI insights',
    actionableSteps: ['Step 1', 'Step 2']
  }),
  generateForecastInsights: vi.fn().mockResolvedValue({
    insight: 'Mocked forecast insight',
    highestRiskArea: 'Transport',
    potentialReduction: '10%'
  })
}));

describe('AI Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'AI User',
      email: 'ai@example.com',
      password: 'password123'
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  });

  describe('GET /api/ai-coach/latest', () => {
    it('should return AI coach insights', async () => {
      const res = await request(app)
        .get('/api/ai-coach/latest')
        .set('Authorization', `Bearer ${token}`);
      
      expect([200, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body.success).toEqual(true);
      }
    });
  });

  describe('GET /api/forecast/data', () => {
    it('should return forecast data or handle empty state', async () => {
      const res = await request(app)
        .get('/api/forecast/data')
        .set('Authorization', `Bearer ${token}`);
      
      expect([200, 404]).toContain(res.statusCode);
      // Empty data state handling
      if (res.statusCode === 404) {
        expect(res.body.needsGeneration).toBe(true);
      } else if (res.statusCode === 200) {
        expect(res.body.needsGeneration).toBe(true);
      } else {
        expect(res.body.success).toEqual(true);
      }
    });
  });
});
