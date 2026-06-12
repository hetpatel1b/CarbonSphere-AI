import { apiClient } from '../lib/apiClient';
import { AchievementDocument, Challenge } from '../types';

export interface ActivityDocument {
  _id: string;
  userId: string;
  activityType: string;
  title?: string;
  description?: string;
  carbonEmission: number;
  category: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityDTO {
  title: string;
  activityType: string;
  description?: string;
  carbonEmission: number;
  category: string;
  date: string;
  notes?: string;
}

interface CreateActivityResponse {
  success: boolean;
  data: ActivityDocument;
  newlyUnlocked?: AchievementDocument[];
  newlyCompletedChallenges?: Challenge[];
}

export const activityService = {
  async getActivities(page?: number, limit?: number): Promise<{ data: ActivityDocument[], pagination?: { page: number, limit: number, skip: number, total: number, pages: number } }> {
    let path = '/activities';
    const params = [];
    if (page !== undefined) params.push(`page=${page}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    if (params.length > 0) path += `?${params.join('&')}`;

    return apiClient.get(path);
  },

  async getActivity(id: string): Promise<ActivityDocument> {
    const res = await apiClient.get<{ success: boolean; data: ActivityDocument }>(`/activities/${id}`);
    return res.data;
  },

  async createActivity(data: CreateActivityDTO): Promise<{ activity: ActivityDocument, newlyUnlocked: AchievementDocument[], newlyCompletedChallenges: Challenge[] }> {
    const res = await apiClient.post<CreateActivityResponse>('/activities', data);
    return {
      activity: res.data,
      newlyUnlocked: res.newlyUnlocked || [],
      newlyCompletedChallenges: res.newlyCompletedChallenges || []
    };
  },

  async updateActivity(id: string, data: Partial<CreateActivityDTO>): Promise<ActivityDocument> {
    const res = await apiClient.put<{ success: boolean; data: ActivityDocument }>(`/activities/${id}`, data);
    return res.data;
  },

  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`/activities/${id}`);
  }
};
