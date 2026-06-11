import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const runSimulation = async (scenarioId: string) => {
  const response = await fetch(`${API_URL}/simulator/run`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ scenarioId })
  });
  if (!response.ok) throw new Error('Failed to run simulation');
  return response.json();
};

export const fetchSimulationHistory = async () => {
  const response = await fetch(`${API_URL}/simulator/history`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};
