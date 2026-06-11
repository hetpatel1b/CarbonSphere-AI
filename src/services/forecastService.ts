import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchForecastSummary = async () => {
  const response = await fetch(`${API_URL}/forecast/summary`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch summary');
  return response.json();
};

export const fetchForecastTrends = async () => {
  const response = await fetch(`${API_URL}/forecast/trends`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch trends');
  return response.json();
};

export const fetchForecastPredictions = async () => {
  const response = await fetch(`${API_URL}/forecast/predictions`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch predictions');
  return response.json();
};

export const fetchForecastInsights = async () => {
  const response = await fetch(`${API_URL}/forecast/insights`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch insights');
  return response.json();
};
