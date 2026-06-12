import { logout } from './auth';

const cache = new Map<string, { data: Record<string, string | number | boolean | null | undefined | object>; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<Record<string, string | number | boolean | null | undefined | object>>>();

const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export const fetchWithCache = async (url: string, options: RequestInit = {}, forceRefresh = false) => {
  const requestOptions: RequestInit = {
    ...options,
    credentials: options.credentials || 'include'
  };

  // Only cache GET requests
  if (options.method && options.method !== 'GET') {
    const res = await fetch(url, requestOptions);
    if (res.status === 401) {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
        const error = new Error('API request failed') as Error & { status?: number; data?: Record<string, string | number | boolean | null | object | undefined> };
        error.status = res.status;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errJson = await res.json();
            (error as Error).message = errJson.message || 'API request failed';
            error.data = errJson;
        }
        throw error;
    }
    return res.json();
  }

  const cacheKey = url;

  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  if (!forceRefresh && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const promise = fetch(url, requestOptions).then(async (res) => {
    if (res.status === 401) {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
        const error = new Error('API request failed') as Error & { status?: number; data?: Record<string, string | number | boolean | null | object | undefined> };
        error.status = res.status;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errJson = await res.json();
            (error as Error).message = errJson.message || 'API request failed';
            error.data = errJson;
        }
        throw error;
    }
    const data = await res.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    inFlightRequests.delete(cacheKey);
    return data;
  }).catch((err) => {
    inFlightRequests.delete(cacheKey);
    throw err;
  });

  inFlightRequests.set(cacheKey, promise);
  return promise;
};

export const clearApiCache = () => {
  cache.clear();
};
