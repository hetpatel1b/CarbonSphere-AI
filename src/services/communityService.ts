import { apiClient } from '../lib/apiClient';
import { ApiResponse, Challenge } from '../types';

export const fetchCommunityStats = async (): Promise<ApiResponse<{ stats: any; chartData: any[] }>> => {
  return apiClient.get<ApiResponse<{ stats: any; chartData: any[] }>>('/community/stats');
};

export const fetchLeaderboard = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get<ApiResponse<any[]>>('/community/leaderboard');
};

export const fetchCommunityFeed = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get<ApiResponse<any[]>>('/community/feed');
};

export const fetchCommunityChallenges = async (): Promise<ApiResponse<Challenge[]>> => {
  return apiClient.get<ApiResponse<Challenge[]>>('/community/challenges');
};

export const joinChallenge = async (id: string): Promise<ApiResponse<any>> => {
  return apiClient.post<ApiResponse<any>>(`/community/challenges/${id}/join`);
};
