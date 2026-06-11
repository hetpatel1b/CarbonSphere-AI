const request = require('supertest');
const app = require('../src/app');
const CarbonLog = require('../src/models/CarbonLog');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/CarbonLog');
jest.mock('../src/models/User');

describe('Carbon Logs API', () => {
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

  describe('POST /api/carbonlogs', () => {
    it('should create a new carbon log', async () => {
      CarbonLog.prototype.save = jest.fn().mockResolvedValue(true);

      const res = await request(app)
        .post('/api/carbonlogs')
        .set('Authorization', 'Bearer fake-token')
        .send({
          activityId: '507f1f77bcf86cd799439012',
          carbonEmission: 15.5,
          category: 'Energy',
          month: 'June',
          year: 2026
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
    });
  });

  describe('GET /api/carbonlogs/summary', () => {
    it('should get carbon logs summary', async () => {
      CarbonLog.aggregate.mockResolvedValue([
        { _id: 'Energy', totalEmission: 120.5, count: 5 }
      ]);

      const res = await request(app)
        .get('/api/carbonlogs/summary')
        .set('Authorization', 'Bearer fake-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.totalCarbon).toEqual(120.5);
      expect(res.body.data.totalActivities).toEqual(5);
      expect(res.body.data.categoryBreakdown['Energy']).toEqual(120.5);
    });
  });
});
