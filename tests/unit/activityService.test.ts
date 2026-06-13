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


  it('should throw error on missing required fields', async () => {
    const invalidActivity = { title: '' } as any; // Missing type, emission, date, etc.
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Missing required fields'));
    await expect(activityService.createActivity(invalidActivity)).rejects.toThrow('Missing required fields');
  });

  it('should throw error on invalid emission values', async () => {
    const invalidActivity = { title: 'Test', activityType: 'Transport', carbonEmission: -50, category: 'Transport', date: '2026-01-01', details: {} };
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid emission value'));
    await expect(activityService.createActivity(invalidActivity)).rejects.toThrow('Invalid emission value');
  });

  it('should throw error on database failure', async () => {
    const newActivity = { title: 'Test', activityType: 'Transport', carbonEmission: 10, category: 'Transport', date: '2026-01-01', details: {} };
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Database error'));
    await expect(activityService.createActivity(newActivity)).rejects.toThrow('Database error');
  });
});
