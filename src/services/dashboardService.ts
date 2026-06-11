import { getToken, logout } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DashboardSummary {
  totalActivities: number;
  totalCarbon: number;
  sustainabilityScore: number;
  currentMonthCarbon: number;
  currentWeekCarbon: number;
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

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_URL}/dashboard/summary`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    const response = await fetch(`${API_URL}/dashboard/analytics`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};
