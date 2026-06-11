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
  if (!response.ok) throw new Error('Failed to fetch forecast data');
  return response.json();
};
