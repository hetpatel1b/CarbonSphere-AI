import { getToken } from '../utils/auth';
import { fetchWithCache, clearApiCache } from '../utils/apiCache';
import { AIInsight } from './aiCoachService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DashboardSummary {
  totalActivities: number;
  totalCarbon: number;
  sustainabilityScore: number;
  currentMonthCarbon: number;
  currentWeekCarbon: number;
  totalAchievementsUnlocked?: number;
  activeChallengesCount?: number;
  completedChallengesCount?: number;
  aiInsight?: AIInsight;
}

export interface ActivityDocument {
  _id: string;
  activityType: string;
  title?: string;
  description: string;
  carbonEmission: number;
  category: string;
  date: string;
}

export interface DashboardAnalytics {
  carbonTrend: { month: string; totalCarbon: number; activitiesCount: number }[];
  monthlyTotals: { month: string; totalCarbon: number; activitiesCount: number }[];
  categoryBreakdown: { category: string; totalCarbon: number }[];
  recentActivities: ActivityDocument[];
}

const getHeaders = () => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const dashboardService = {
  async getSummary(forceRefresh = false): Promise<DashboardSummary> {
    const data = await fetchWithCache(`${API_URL}/dashboard/summary`, {
      method: 'GET',
      headers: getHeaders(),
    }, forceRefresh);
    return data.data;
  },

  async getAnalytics(forceRefresh = false): Promise<DashboardAnalytics> {
    const data = await fetchWithCache(`${API_URL}/dashboard/analytics`, {
      method: 'GET',
      headers: getHeaders(),
    }, forceRefresh);
    return data.data;
  },

  clearCache() {
    clearApiCache();
  }
};
