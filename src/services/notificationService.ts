import { apiClient } from '../lib/apiClient';
import { ApiResponse, Notification } from '../types';

export type { Notification };

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
  return res.data;
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const res = await apiClient.patch<ApiResponse<Notification>>(`/notifications/read/${id}`);
  return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch<ApiResponse<void>>('/notifications/read-all');
};
