import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiCoachService } from '../../src/services/aiCoachService';
import { apiClient } from '../../src/lib/apiClient';

vi.mock('../../src/lib/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('aiCoachService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockInsightData = {
    insight: { score: 85, strengths: [], weaknesses: [], challengeSuggestion: 'Try a week without meat.' },
    recommendations: []
  };

  it('should fetch latest insight successfully', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockInsightData });
    const result = await aiCoachService.getLatestInsight();
    expect(apiClient.get).toHaveBeenCalledWith('/ai-coach/latest');
    expect(result).toEqual(mockInsightData);
  });

  it('should generate new analysis successfully', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockInsightData });
    const result = await aiCoachService.generateNewAnalysis();
    expect(apiClient.post).toHaveBeenCalledWith('/ai-coach/analyze');
    expect(result).toEqual(mockInsightData);
  });

  it('should throw error on Groq API timeout / API failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Request timeout'));
    await expect(aiCoachService.generateNewAnalysis()).rejects.toThrow('Request timeout');
  });

  it('should handle empty response gracefully by propagating the error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('No insights found'));
    await expect(aiCoachService.getLatestInsight()).rejects.toThrow('No insights found');
  });
});
