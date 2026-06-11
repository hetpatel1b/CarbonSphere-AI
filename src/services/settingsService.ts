import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchProfile = async () => {
  const response = await fetch(`${API_URL}/settings/profile`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateProfile = async (data: any) => {
  const response = await fetch(`${API_URL}/settings/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const updatePreferences = async (data: any) => {
  const response = await fetch(`${API_URL}/settings/preferences`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update preferences');
  return response.json();
};

export const updateNotifications = async (data: any) => {
  const response = await fetch(`${API_URL}/settings/notifications`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update notifications');
  return response.json();
};

export const updatePassword = async (data: any) => {
  const response = await fetch(`${API_URL}/settings/password`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Failed to update password');
  return resData;
};

export const exportData = async () => {
  const response = await fetch(`${API_URL}/settings/export`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to export data');
  return response.json();
};

export const deleteAccount = async () => {
  const response = await fetch(`${API_URL}/settings/account`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete account');
  return response.json();
};
