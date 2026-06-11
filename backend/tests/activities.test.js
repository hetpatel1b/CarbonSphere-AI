const request = require('supertest');
const app = require('../src/app');
const Activity = require('../src/models/Activity');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/Activity');
jest.mock('../src/models/User');
jest.mock('../src/services/achievementEngine', () => ({
  checkAndUnlockAchievements: jest.fn().mockResolvedValue([])
}));
jest.mock('../src/services/challengeEngine', () => ({
  checkAndUpdateChallenges: jest.fn().mockResolvedValue([])
}));

describe('Activities API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock JWT and User for authMiddleware using valid ObjectId
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: '507f1f77bcf86cd799439011' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', name: 'Test User' })
    });
  });

  afterAll(() => {
    jwt.verify.mockRestore();
  });

  describe('POST /api/activities', () => {
    it('should create a new activity', async () => {
      // Mock the save method
      Activity.prototype.save = jest.fn().mockResolvedValue(true);

      const res = await request(app)
        .post('/api/activities')
        .set('Authorization', 'Bearer fake-token')
        .send({
          activityType: 'Bicycle Commute',
          category: 'Transportation',
          carbonEmission: 0,
          duration: 30,
          distance: 5
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
    });
  });

  describe('GET /api/activities', () => {
    it('should get user activities', async () => {
      const mockActivities = [
        { _id: 'act1', activityType: 'Bicycle Commute' },
        { _id: 'act2', activityType: 'Recycling' }
      ];

      Activity.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockActivities)
      });

      const res = await request(app)
        .get('/api/activities')
        .set('Authorization', 'Bearer fake-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.count).toEqual(2);
    });
  });
});
