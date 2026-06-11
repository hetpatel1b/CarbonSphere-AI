import { getToken, logout } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface AchievementDocument {
  _id: string;
  title: string;
  description: string;
  badgeIcon: string;
  points: number;
  category: string;
  criteria: any;
  isActive: boolean;
  unlocked: boolean;
  progress: number;
  unlockedAt: string | null;
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

export const achievementService = {
  async getAchievementStatus(): Promise<AchievementDocument[]> {
    const response = await fetch(`${API_URL}/achievements/status`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};
