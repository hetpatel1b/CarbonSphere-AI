import { apiClient } from '../lib/apiClient';
import { ApiResponse, OffsetProject, OffsetPurchase, OffsetStats, AIRecommendation } from '../types';

export const fetchOffsetProjects = async (): Promise<ApiResponse<OffsetProject[]>> => {
  return apiClient.get<ApiResponse<OffsetProject[]>>('/offsets/projects');
};

export const fetchOffsetRecommendations = async (): Promise<ApiResponse<AIRecommendation[]>> => {
  return apiClient.get<ApiResponse<AIRecommendation[]>>('/offsets/recommendations');
};

export const purchaseOffset = async (projectId: string, credits: number): Promise<ApiResponse<OffsetPurchase>> => {
  return apiClient.post<ApiResponse<OffsetPurchase>>('/offsets/purchase', { projectId, credits });
};

export const fetchOffsetHistory = async (page: number = 1, limit: number = 10): Promise<ApiResponse<OffsetPurchase[]>> => {
  return apiClient.get<ApiResponse<OffsetPurchase[]>>(`/offsets/history?page=${page}&limit=${limit}`);
};

export const fetchOffsetStats = async (): Promise<ApiResponse<OffsetStats>> => {
  return apiClient.get<ApiResponse<OffsetStats>>('/offsets/stats');
};
