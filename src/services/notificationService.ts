import { getToken, logout } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'achievement' | 'challenge' | 'report' | 'recommendation' | 'system';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
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
    throw new Error('Authentication expired');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data; // Note: For lists, the backend might return `data` or `data` array. Based on controller, it returns { success, count, data: notifications }
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const response = await fetch(`${API_URL}/notifications/read/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  
  if (response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication expired');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
};
