import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchForecastData = async () => {
  const response = await fetch(`${API_URL}/forecast/data`, { headers: getHeaders() });
  
  if (response.status === 404) {
    const data = await response.json();
    return { ...data, needsGeneration: true };
  }

  if (!response.ok) throw new Error('Failed to fetch forecast data');
  return response.json();
};

export const generateForecast = async () => {
  const response = await fetch(`${API_URL}/forecast/generate`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to generate forecast');
  }
  return response.json();
};

export const applyAction = async (data: { title: string, reduction: number, difficulty: string, impact: string }) => {
  const response = await fetch(`${API_URL}/actions/apply`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to apply action');
  }
  return response.json();
};
