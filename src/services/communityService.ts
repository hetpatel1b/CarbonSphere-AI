import { apiClient } from '../lib/apiClient';
import { ApiResponse } from '../types';

export interface CommunityStats {
  totalUsers: number;
  totalCarbonSaved: number;
  activeChallengesCount: number;
  totalBadges: number;
  [key: string]: string | number;
}

export interface ChartDataPoint {
  month: string;
  reduction: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  score: number;
  isCurrentUser?: boolean;
}

export interface FeedItem {
  id: string;
  user: string;
  title: string;
  description: string;
  type: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  progress: number;
  participants: number;
  hasJoined: boolean;
}

export const fetchCommunityStats = async (): Promise<ApiResponse<{ stats: CommunityStats; chartData: ChartDataPoint[] }>> => {
  return apiClient.get<ApiResponse<{ stats: CommunityStats; chartData: ChartDataPoint[] }>>('/community/stats');
};

export const fetchLeaderboard = async (): Promise<ApiResponse<LeaderboardEntry[]>> => {
  return apiClient.get<ApiResponse<LeaderboardEntry[]>>('/community/leaderboard');
};

export const fetchCommunityFeed = async (): Promise<ApiResponse<FeedItem[]>> => {
  return apiClient.get<ApiResponse<FeedItem[]>>('/community/feed');
};

export const fetchCommunityChallenges = async (): Promise<ApiResponse<CommunityChallenge[]>> => {
  return apiClient.get<ApiResponse<CommunityChallenge[]>>('/community/challenges');
};

export const joinChallenge = async (id: string): Promise<ApiResponse<{ hasJoined: boolean }>> => {
  return apiClient.post<ApiResponse<{ hasJoined: boolean }>>(`/community/challenges/${id}/join`);
};
