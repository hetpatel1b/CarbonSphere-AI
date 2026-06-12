import { apiClient } from '../lib/apiClient';
import { ApiResponse, UserProfile } from '../types';

export interface ProfileData {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface PreferencesData {
  goal?: string;
  transport?: string;
  energy?: string;
  dietary?: string;
  compactView?: boolean;
  darkMode?: boolean;
  reduceAnimations?: boolean;
  currency?: string;
  measurement?: string;
  theme?: string;
}

export interface NotificationsData {
  emailAlerts?: boolean;
  weeklyReport?: boolean;
  weeklyReports?: boolean;
  pushNotifications?: boolean;
  aiInsights?: boolean;
  challengeUpdates?: boolean;
  marketplaceUpdates?: boolean;
}

export interface PasswordData {
  currentPassword?: string;
  newPassword?: string;
}

export const fetchProfile = async (): Promise<ApiResponse<UserProfile>> => {
  return apiClient.get<ApiResponse<UserProfile>>('/settings/profile');
};

export const updateProfile = async (data: ProfileData): Promise<ApiResponse<UserProfile>> => {
  return apiClient.put<ApiResponse<UserProfile>>('/settings/profile', data);
};

export const updatePreferences = async (data: PreferencesData): Promise<ApiResponse<UserProfile>> => {
  return apiClient.put<ApiResponse<UserProfile>>('/settings/preferences', data);
};

export const updateNotifications = async (data: NotificationsData): Promise<ApiResponse<UserProfile>> => {
  return apiClient.put<ApiResponse<UserProfile>>('/settings/notifications', data);
};

export const updatePassword = async (data: PasswordData): Promise<ApiResponse<void>> => {
  return apiClient.put<ApiResponse<void>>('/settings/password', data);
};

export const exportData = async (): Promise<ApiResponse<any>> => {
  return apiClient.get<ApiResponse<any>>('/settings/export');
};

export const deleteAccount = async (): Promise<ApiResponse<void>> => {
  return apiClient.delete<ApiResponse<void>>('/settings/account');
};
