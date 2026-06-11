import { getToken, logout } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

  return data.data; // Return the nested data payload
};

// Cache setup to prevent 429 Too Many Requests
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

let summaryCache: CacheItem<DashboardSummary> | null = null;
let analyticsCache: CacheItem<DashboardAnalytics> | null = null;

let summaryPromise: Promise<DashboardSummary> | null = null;
let analyticsPromise: Promise<DashboardAnalytics> | null = null;

// Helper to check if cache is valid
const isCacheValid = (cacheItem: CacheItem<any> | null): boolean => {
  if (!cacheItem) return false;
  return Date.now() - cacheItem.timestamp < CACHE_TTL;
};

export const dashboardService = {
  async getSummary(forceRefresh = false): Promise<DashboardSummary> {
    if (!forceRefresh && isCacheValid(summaryCache)) {
      return summaryCache!.data;
    }

    if (!forceRefresh && summaryPromise) {
      return summaryPromise;
    }

    summaryPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/summary`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const data = await handleResponse(response);
        summaryCache = { data, timestamp: Date.now() };
        return data;
      } finally {
        summaryPromise = null;
      }
    })();

    return summaryPromise;
  },

  async getAnalytics(forceRefresh = false): Promise<DashboardAnalytics> {
    if (!forceRefresh && isCacheValid(analyticsCache)) {
      return analyticsCache!.data;
    }

    if (!forceRefresh && analyticsPromise) {
      return analyticsPromise;
    }

    analyticsPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/analytics`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const data = await handleResponse(response);
        analyticsCache = { data, timestamp: Date.now() };
        return data;
      } finally {
        analyticsPromise = null;
      }
    })();

    return analyticsPromise;
  },

  clearCache() {
    summaryCache = null;
    analyticsCache = null;
  }
};
