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

export const fetchForecastData = async () => {
  try {
    const response = await fetchWithCache(`${API_URL}/forecast/data`, { headers: getHeaders() });
    return response.data; // backend wraps in data for success
  } catch (error: any) {
    if (error.status === 404) {
      return { ...(error.data || {}), needsGeneration: true };
    }
    throw error;
  }
};

export const generateForecast = async () => {
  const response = await fetchWithCache(`${API_URL}/forecast/generate`, {
    method: 'POST',
    headers: getHeaders()
  });
  return response;
};

export const applyAction = async (data: { title: string, reduction: number, difficulty: string, impact: string }) => {
  const response = await fetchWithCache(`${API_URL}/actions/apply`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return response;
};
