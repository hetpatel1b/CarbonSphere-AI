import { apiClient } from '../lib/apiClient';
import { clearApiCache } from '../utils/apiCache';
import { AIInsight } from './aiCoachService';

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

export const dashboardService = {
  async getSummary(forceRefresh = false): Promise<DashboardSummary> {
    const res = await apiClient.get<{ success: boolean; data: DashboardSummary }>(
      '/dashboard/summary',
      {},
      forceRefresh
    );
    return res.data;
  },

  async getAnalytics(forceRefresh = false): Promise<DashboardAnalytics> {
    const res = await apiClient.get<{ success: boolean; data: DashboardAnalytics }>(
      '/dashboard/analytics',
      {},
      forceRefresh
    );
    return res.data;
  },

  clearCache() {
    clearApiCache();
  }
};
