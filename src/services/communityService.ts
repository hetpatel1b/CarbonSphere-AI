import { apiClient } from '../lib/apiClient';
import { ApiResponse, Challenge } from '../types';

export const fetchCommunityStats = async (): Promise<ApiResponse<{ stats: Record<string, unknown>; chartData: unknown[] }>> => {
  return apiClient.get<ApiResponse<{ stats: Record<string, unknown>; chartData: unknown[] }>>('/community/stats');
};

export const fetchLeaderboard = async (): Promise<ApiResponse<unknown[]>> => {
  return apiClient.get<ApiResponse<unknown[]>>('/community/leaderboard');
};

export const fetchCommunityFeed = async (): Promise<ApiResponse<unknown[]>> => {
  return apiClient.get<ApiResponse<unknown[]>>('/community/feed');
};

export const fetchCommunityChallenges = async (): Promise<ApiResponse<Challenge[]>> => {
  return apiClient.get<ApiResponse<Challenge[]>>('/community/challenges');
};

export const joinChallenge = async (id: string): Promise<ApiResponse<unknown>> => {
  return apiClient.post<ApiResponse<unknown>>(`/community/challenges/${id}/join`);
};
