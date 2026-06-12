import { getToken } from '../utils/auth';
import { fetchWithCache } from '../utils/apiCache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchOffsetProjects = async () => {
  return fetchWithCache(`${API_URL}/offsets/projects`, { headers: getHeaders() });
};

export const fetchOffsetRecommendations = async () => {
  return fetchWithCache(`${API_URL}/offsets/recommendations`, { headers: getHeaders() });
};

export const purchaseOffset = async (projectId: string, credits: number) => {
  const response = await fetchWithCache(`${API_URL}/offsets/purchase`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ projectId, credits })
  });
  return response;
};

export const fetchOffsetHistory = async (page: number = 1, limit: number = 10) => {
  return fetchWithCache(`${API_URL}/offsets/history?page=${page}&limit=${limit}`, { headers: getHeaders() });
};

export const fetchOffsetStats = async () => {
  return fetchWithCache(`${API_URL}/offsets/stats`, { headers: getHeaders() });
};
