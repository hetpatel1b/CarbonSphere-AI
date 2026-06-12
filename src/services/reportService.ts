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

export const fetchReports = async () => {
  return fetchWithCache(`${API_URL}/reports`, { headers: getHeaders() });
};

export const fetchReportById = async (id: string) => {
  return fetchWithCache(`${API_URL}/reports/${id}`, { headers: getHeaders() });
};

export const generateReport = async (reportType: string) => {
  const response = await fetchWithCache(`${API_URL}/reports/generate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ reportType })
  });
  return response;
};

export const deleteReport = async (id: string) => {
  const response = await fetchWithCache(`${API_URL}/reports/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response;
};
