import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');

// Directly override groqService singleton methods to bypass Vitest loader mock issues
const groqService = require('../src/services/groqService');
groqService.generateAssistantResponse = async () => {
  return {
    insight: "Mocked AI sustainability insights. Target reduction in transport emissions.",
    highestRiskArea: "Transport",
    potentialReduction: "12.5%",
    recommendations: [
      {
        title: "Use Public Transit",
        description: "Replace driving with train/bus commute.",
        reduction: 0.5,
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        title: "Unplug Standby Devices",
        description: "Turn off power strips when not in use.",
        reduction: 0.1,
        difficulty: "Easy",
        impact: "Low"
      },
      {
        title: "Transition to Solar energy",
        description: "Install solar panels or subscribe to green power.",
        reduction: 1.2,
        difficulty: "Hard",
        impact: "High"
      },
      {
        title: "Eat Plant-Based Meals",
        description: "Reduce meat consumption to lower agricultural impact.",
        reduction: 0.3,
        difficulty: "Medium",
        impact: "Medium"
      }
    ]
  };
};

groqService.getHealthStats = () => {
  return {
    status: "healthy",
    availableKeys: 1,
    activeKey: 1
  };
};

const app = require('../src/app');
const User = require('../src/models/User');
const Activity = require('../src/models/Activity');
const jwt = require('jsonwebtoken');

describe('Forecast & Action Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Forecast User',
      email: 'forecast@example.com',
      password: 'password123'
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    // Seed some activity history to populate data
    await Activity.create({
      userId,
      category: 'Transport',
      activityType: 'Driving',
      carbonEmission: 50.0,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    });
  });

  describe('GET /api/forecast/data (No forecast created yet)', () => {
    it('should return 404 with needsGeneration flag', async () => {
      const res = await request(app)
        .get('/api/forecast/data')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.needsGeneration).toEqual(true);
    });
  });

  describe('POST /api/forecast/generate', () => {
    it('should generate a new forecast record and return predictions', async () => {
      const res = await request(app)
        .post('/api/forecast/generate')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.predictionSeries).toBeDefined();
      expect(res.body.data.currentMonth).toBeGreaterThanOrEqual(0);
    });
  });

  describe('POST /api/actions/apply', () => {
    it('should successfully apply a sustainability action plan', async () => {
      const res = await request(app)
        .post('/api/actions/apply')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Unplug Standby Devices',
          reduction: 5.5,
          difficulty: 'Easy',
          impact: 'Low'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body.data.actionTitle).toEqual('Unplug Standby Devices');
    });

    it('should reject applying a duplicate action', async () => {
      // First commit
      await request(app)
        .post('/api/actions/apply')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Ride Bicycle',
          reduction: 15.0
        });

      // Second commit (duplicate)
      const res = await request(app)
        .post('/api/actions/apply')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Ride Bicycle',
          reduction: 15.0
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toEqual(false);
    });
  });
});
