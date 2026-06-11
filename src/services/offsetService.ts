import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchOffsetProjects = async () => {
  const response = await fetch(`${API_URL}/offsets/projects`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const fetchOffsetRecommendations = async () => {
  const response = await fetch(`${API_URL}/offsets/recommendations`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
};

export const purchaseOffset = async (projectId: string, credits: number) => {
  const response = await fetch(`${API_URL}/offsets/purchase`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ projectId, credits })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to purchase offset');
  }
  return response.json();
};

export const fetchOffsetHistory = async (page: number = 1, limit: number = 10) => {
  const response = await fetch(`${API_URL}/offsets/history?page=${page}&limit=${limit}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

export const fetchOffsetStats = async () => {
  const response = await fetch(`${API_URL}/offsets/stats`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};
