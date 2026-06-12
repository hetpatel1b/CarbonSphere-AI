import { logout } from './auth';

const cache = new Map<string, { data: any; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any>>();

const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export const fetchWithCache = async (url: string, options: RequestInit = {}, forceRefresh = false) => {
  // Only cache GET requests
  if (options.method && options.method !== 'GET') {
    const res = await fetch(url, options);
    if (res.status === 401) {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
        const error: any = new Error('API request failed');
        error.status = res.status;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errJson = await res.json();
            error.message = errJson.message || 'API request failed';
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

  const promise = fetch(url, options).then(async (res) => {
    if (res.status === 401) {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
        const error: any = new Error('API request failed');
        error.status = res.status;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errJson = await res.json();
            error.message = errJson.message || 'API request failed';
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
