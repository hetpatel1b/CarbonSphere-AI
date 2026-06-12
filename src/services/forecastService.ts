import { apiClient } from '../lib/apiClient';
import { ApiResponse, ForecastData } from '../types';

export const fetchForecastData = async (): Promise<ForecastData & { needsGeneration?: boolean }> => {
  try {
    const response = await apiClient.get<ApiResponse<ForecastData>>('/forecast/data');
    return response.data;
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string };
    if (err.status === 404) {
      return { ...(err.data || {}), needsGeneration: true } as unknown as ForecastData;
    }
    throw error;
  }
};

export const generateForecast = async (): Promise<ApiResponse<ForecastData>> => {
  return apiClient.post<ApiResponse<ForecastData>>('/forecast/generate');
};

export const applyAction = async (data: { title: string; reduction: number; difficulty: string; impact: string }): Promise<ApiResponse<unknown>> => {
  return apiClient.post<ApiResponse<unknown>>('/actions/apply', data);
};
