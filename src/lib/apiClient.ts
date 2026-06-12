import { getToken, logout } from '../utils/auth';
import { fetchWithCache } from '../utils/apiCache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = (customHeaders?: HeadersInit) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication expired. Please log in again.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const apiClient = {
  
  async get<T>(path: string, options: RequestInit = {}, forceRefresh = false): Promise<T> {
    const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
    return fetchWithCache(fullUrl, {
      ...options,
      method: 'GET',
      headers: getHeaders(options.headers),
    }, forceRefresh);
  },

  async post<T>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      ...options,
      method: 'POST',
      headers: getHeaders(options.headers),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  async put<T>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      ...options,
      method: 'PUT',
      headers: getHeaders(options.headers),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  async patch<T>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      ...options,
      method: 'PATCH',
      headers: getHeaders(options.headers),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      ...options,
      method: 'DELETE',
      headers: getHeaders(options.headers),
      credentials: 'include',
    });
    return handleResponse(response);
  }
};
