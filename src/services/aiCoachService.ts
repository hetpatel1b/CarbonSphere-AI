import { getToken, logout } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AIRecommendation {
  _id?: string;
  title: string;
  description: string;
  category: string;
  saving?: string; // Stored as estimatedCarbonSaving in DB but we might map it
  estimatedCarbonSaving?: number;
  confidence?: number;
}

export interface AIInsight {
  score: number;
  strengths: string[];
  weaknesses: string[];
  monthlyGoal: string;
  carbonReductionPotential: string;
  challengeSuggestion: string;
  generatedAt?: string;
}

export interface AICoachResponse {
  insight: AIInsight;
  recommendations: AIRecommendation[];
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
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Authentication expired. Please log in again.');
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data.data;
};

export const aiCoachService = {
  async getLatestInsight(): Promise<AICoachResponse> {
    const response = await fetch(`${API_URL}/ai-coach/latest`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async generateNewAnalysis(): Promise<AICoachResponse> {
    const response = await fetch(`${API_URL}/ai-coach/analyze`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};
