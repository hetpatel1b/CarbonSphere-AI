import { apiClient } from '../lib/apiClient';

export interface ChallengeDocument {
  _id: string;
  title: string;
  description: string;
  targetValue: number;
  category: string;
  rewardPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: string;
  endDate: string;
  isActive: boolean;
  icon: string;
  color: string;
  joined?: boolean;
  completed?: boolean;
  progress?: number;
  joinedAt?: string;
}

export interface ChallengeStats {
  challengesJoined: number;
  challengesCompleted: number;
  pointsEarned: number;
}

export interface ChallengeStatusResponse {
  active: ChallengeDocument[];
  completed: ChallengeDocument[];
  upcoming: ChallengeDocument[];
  available: ChallengeDocument[];
  stats: ChallengeStats;
}

export const challengeService = {
  async getChallengeStatus(): Promise<ChallengeStatusResponse> {
    const res = await apiClient.get<{ success: boolean; data: ChallengeStatusResponse }>('/challenges/status');
    return res.data;
  },

  async joinChallenge(id: string): Promise<any> {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/challenges/join/${id}`);
    return res.data;
  }
};
