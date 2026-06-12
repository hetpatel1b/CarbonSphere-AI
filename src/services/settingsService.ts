import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const fetchWithCreds = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
    credentials: 'include'
  });
};

export const fetchProfile = async () => {
  const response = await fetchWithCreds(`${API_URL}/settings/profile`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

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

export const updateProfile = async (data: ProfileData) => {
  const response = await fetchWithCreds(`${API_URL}/settings/profile`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const updatePreferences = async (data: PreferencesData) => {
  const response = await fetchWithCreds(`${API_URL}/settings/preferences`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update preferences');
  return response.json();
};

export const updateNotifications = async (data: NotificationsData) => {
  const response = await fetchWithCreds(`${API_URL}/settings/notifications`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update notifications');
  return response.json();
};

export const updatePassword = async (data: PasswordData) => {
  const response = await fetchWithCreds(`${API_URL}/settings/password`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Failed to update password');
  return resData;
};

export const exportData = async () => {
  const response = await fetchWithCreds(`${API_URL}/settings/export`);
  if (!response.ok) throw new Error('Failed to export data');
  return response.json();
};

export const deleteAccount = async () => {
  const response = await fetchWithCreds(`${API_URL}/settings/account`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete account');
  return response.json();
};
