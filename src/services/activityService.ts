import { getToken, logout } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

export const activityService = {
  async getActivities(): Promise<ActivityDocument[]> {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getActivity(id: string): Promise<ActivityDocument> {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async createActivity(data: CreateActivityDTO): Promise<ActivityDocument> {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateActivity(id: string, data: Partial<CreateActivityDTO>): Promise<ActivityDocument> {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteActivity(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  }
};
