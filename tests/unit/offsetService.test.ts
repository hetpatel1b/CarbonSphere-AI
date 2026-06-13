import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchOffsetProjects, purchaseOffset } from '../../src/services/offsetService';
import { apiClient } from '../../src/lib/apiClient';

vi.mock('../../src/lib/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('offsetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProjects = [
    { id: '1', name: 'Forest Project', description: 'desc', pricePerTon: 15, certified: true, availableTons: 100, category: 'Forestry', riskLevel: 'Low' }
  ];

  it('should fetch offset projects successfully', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockProjects });
    const result = await fetchOffsetProjects();
    expect(apiClient.get).toHaveBeenCalledWith('/offsets/projects');
    expect(result).toEqual({ data: mockProjects });
  });

  it('should handle empty marketplace safely', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });
    const result = await fetchOffsetProjects();
    expect(result).toEqual({ data: [] });
  });

  it('should successfully purchase offset', async () => {
    const mockReceipt = { id: 'receipt-1', projectId: '1', amountInTons: 10, totalCost: 150, date: '2026-01-01', certificateUrl: 'url' };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockReceipt });
    const result = await purchaseOffset('1', 10);
    expect(apiClient.post).toHaveBeenCalledWith('/offsets/purchase', { projectId: '1', credits: 10 });
    expect(result).toEqual({ data: mockReceipt });
  });

  it('should throw error on invalid project selection', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Project not found'));
    await expect(purchaseOffset('invalid-id', 10)).rejects.toThrow('Project not found');
  });

  it('should throw error on purchase failure (e.g., insufficient funds/availability)', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Insufficient availability'));
    await expect(purchaseOffset('1', 1000)).rejects.toThrow('Insufficient availability');
  });
});
