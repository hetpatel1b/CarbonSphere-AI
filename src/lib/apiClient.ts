import { logout } from '../utils/auth';
import { fetchWithCache } from '../utils/apiCache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getCsrfToken = () => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )csrfToken=([^;]+)'));
  if (match) return match[2];
  return '';
};

const getHeaders = (customHeaders?: HeadersInit) => {
  const csrfToken = getCsrfToken();
  return {
    'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
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

import { handleDemoRequest } from './demoInterceptor';

export const apiClient = {
  
  async get<T>(path: string, options: RequestInit = {}, forceRefresh = false): Promise<T> {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
    if (isDemo) return handleDemoRequest('GET', path) as Promise<T>;

    const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
    return fetchWithCache(fullUrl, {
      ...options,
      method: 'GET',
      headers: getHeaders(options.headers),
    }, forceRefresh);
  },

  async post<T, B extends object | string | FormData = object | string | FormData>(path: string, body?: B, options: RequestInit = {}): Promise<T> {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
    if (isDemo) return handleDemoRequest('POST', path, body) as Promise<T>;

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

  async put<T, B extends object | string | FormData = object | string | FormData>(path: string, body?: B, options: RequestInit = {}): Promise<T> {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
    if (isDemo) return handleDemoRequest('PUT', path, body) as Promise<T>;

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

  async patch<T, B extends object | string | FormData = object | string | FormData>(path: string, body?: B, options: RequestInit = {}): Promise<T> {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
    if (isDemo) return handleDemoRequest('PATCH', path, body) as Promise<T>;

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
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
    if (isDemo) return handleDemoRequest('DELETE', path) as Promise<T>;

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
