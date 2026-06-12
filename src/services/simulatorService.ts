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

export const runSimulation = async (scenarioId: string) => {
  const response = await fetchWithCache(`${API_URL}/simulator/run`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ scenarioId })
  });
  return response;
};

export const fetchSimulationHistory = async () => {
  return fetchWithCache(`${API_URL}/simulator/history`, { headers: getHeaders() });
};
