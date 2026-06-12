import { getToken, logout } from '../utils/auth';
import { fetchWithCache } from '../utils/apiCache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

const getHeaders = () => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication expired. Please log in again.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data; 
};

export const challengeService = {
  async getChallengeStatus(): Promise<ChallengeStatusResponse> {
    const data = await fetchWithCache(`${API_URL}/challenges/status`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return data.data;
  },

  async joinChallenge(id: string): Promise<any> {
    const response = await fetch(`${API_URL}/challenges/join/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  }
};
