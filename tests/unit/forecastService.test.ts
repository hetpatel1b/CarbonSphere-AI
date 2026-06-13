import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchForecastData } from '../../src/services/forecastService';
import { apiClient } from '../../src/lib/apiClient';

vi.mock('../../src/lib/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  }
}));

describe('forecastService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockForecastResponse = {
    forecasts: [{ month: 'Jan', actual: 10, predicted: 12 }],
    insights: 'Forecast looks good',
    accuracy: 95
  };

  it('should fetch forecast data successfully', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockForecastResponse });
    const result = await fetchForecastData();
    expect(apiClient.get).toHaveBeenCalledWith('/forecast/data');
    expect(result).toEqual(mockForecastResponse);
  });

  it('should handle empty dataset safely', async () => {
    const emptyResponse = { forecasts: [], insights: '', accuracy: 0 };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: emptyResponse });
    const result = await fetchForecastData();
    expect(result).toEqual(emptyResponse);
  });

  it('should handle single activity dataset safely', async () => {
    const singleResponse = { forecasts: [{ month: 'Jan', actual: 10, predicted: 10 }], insights: '', accuracy: 100 };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: singleResponse });
    const result = await fetchForecastData();
    expect(result).toEqual(singleResponse);
  });

  it('should handle extreme values safely', async () => {
    const extremeResponse = { forecasts: [{ month: 'Jan', actual: 9999999, predicted: 9999999 }], insights: 'Extreme values detected', accuracy: 50 };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: extremeResponse });
    const result = await fetchForecastData();
    expect(result).toEqual(extremeResponse);
  });

  it('should propagate API errors for forecasting failure', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Failed to generate forecast'));
    await expect(fetchForecastData()).rejects.toThrow('Failed to generate forecast');
  });
});
