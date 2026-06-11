import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchReports = async () => {
  const response = await fetch(`${API_URL}/reports`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch reports');
  return response.json();
};

export const fetchReportById = async (id: string) => {
  const response = await fetch(`${API_URL}/reports/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch report');
  return response.json();
};

export const generateReport = async (reportType: string) => {
  const response = await fetch(`${API_URL}/reports/generate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ reportType })
  });
  if (!response.ok) throw new Error('Failed to generate report');
  return response.json();
};

export const deleteReport = async (id: string) => {
  const response = await fetch(`${API_URL}/reports/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete report');
  return response.json();
};
