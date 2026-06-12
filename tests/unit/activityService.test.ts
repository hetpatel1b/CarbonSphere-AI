import { describe, it, expect, vi, beforeEach } from 'vitest';
import { activityService } from '../../src/services/activityService';
import { apiClient } from '../../src/lib/apiClient';

vi.mock('../../src/lib/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('activityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch activities successfully', async () => {
    const mockResponse = [{ id: '1', title: 'Test Activity' }];
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

    const result = await activityService.getActivities();

    expect(apiClient.get).toHaveBeenCalledWith('/activities');
    expect(result).toEqual(mockResponse);
  });

  it('should create an activity successfully', async () => {
    const newActivity = { title: 'Test', activityType: 'Transport', carbonEmission: 10, category: 'Transport', date: '2026-01-01', details: {} };
    const mockResponse = { data: { id: '2' }, newlyUnlocked: [], newlyCompletedChallenges: [] };
    
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await activityService.createActivity(newActivity);

    expect(apiClient.post).toHaveBeenCalledWith('/activities', newActivity);
    expect(result).toEqual({
      activity: mockResponse.data,
      newlyUnlocked: [],
      newlyCompletedChallenges: []
    });
  });
});
