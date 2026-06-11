const request = require('supertest');
const app = require('../src/app');
const Activity = require('../src/models/Activity');
const CarbonLog = require('../src/models/CarbonLog');
const User = require('../src/models/User');
const UserAchievement = require('../src/models/UserAchievement');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/Activity');
jest.mock('../src/models/CarbonLog');
jest.mock('../src/models/User');
jest.mock('../src/models/UserAchievement');
const UserChallenge = require('../src/models/UserChallenge');
jest.mock('../src/models/UserChallenge');
const UserAction = require('../src/models/UserAction');
jest.mock('../src/models/UserAction');

describe('Dashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: '507f1f77bcf86cd799439011' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', name: 'Test User' })
    });
  });

  afterAll(() => {
    jwt.verify.mockRestore();
  });

  describe('GET /api/dashboard/summary', () => {
    it('should get dashboard summary', async () => {
      Activity.countDocuments.mockResolvedValue(45);
      
      CarbonLog.aggregate.mockResolvedValue([{ total: 1250.5 }]);
      
      Activity.aggregate.mockResolvedValue([{ total: 10 }]); // for month and week

      UserAchievement.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([
            { achievementId: { _id: 'a1', title: 'Test' } }
          ])
        })
      });

      UserChallenge.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          { challengeId: { isActive: true, endDate: new Date('2099-01-01') }, completed: false }
        ])
      });

      UserAction.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { _id: 'ua1', actionTitle: 'Test Action', reduction: 10 }
        ])
      });

      const res = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', 'Bearer fake-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.totalActivities).toEqual(45);
      expect(res.body.data.totalCarbon).toEqual(1250.5);
      expect(res.body.data.sustainabilityScore).toBeDefined();
    });
  });

  describe('GET /api/dashboard/analytics', () => {
    it('should get dashboard analytics data', async () => {
      // Mock Activity.aggregate
      Activity.aggregate.mockImplementation((pipeline) => {
        // Check if it's the category breakdown pipeline
        if (pipeline[1] && pipeline[1].$group && pipeline[1].$group._id === '$category') {
          return Promise.resolve([
            { _id: 'Transportation', totalCarbon: 50 },
            { _id: 'Energy', totalCarbon: 70 }
          ]);
        }
        // Check if it's the monthly totals pipeline
        if (pipeline[1] && pipeline[1].$group && pipeline[1].$group._id && pipeline[1].$group._id.year) {
          return Promise.resolve([
            { _id: { year: 2026, month: 6 }, totalCarbon: 120, count: 5 }
          ]);
        }
        return Promise.resolve([]);
      });

      Activity.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            { _id: 'act1', activityType: 'Bicycle Commute' }
          ])
        })
      });

      const res = await request(app)
        .get('/api/dashboard/analytics')
        .set('Authorization', 'Bearer fake-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.categoryBreakdown).toHaveLength(2);
      expect(res.body.data.recentActivities).toHaveLength(1);
    });
  });
});
