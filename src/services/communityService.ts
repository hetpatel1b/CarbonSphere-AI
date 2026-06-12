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

export const fetchCommunityStats = async () => {
  return fetchWithCache(`${API_URL}/community/stats`, { headers: getHeaders() });
};

export const fetchLeaderboard = async () => {
  return fetchWithCache(`${API_URL}/community/leaderboard`, { headers: getHeaders() });
};

export const fetchCommunityFeed = async () => {
  return fetchWithCache(`${API_URL}/community/feed`, { headers: getHeaders() });
};

export const fetchCommunityChallenges = async () => {
  return fetchWithCache(`${API_URL}/community/challenges`, { headers: getHeaders() });
};

export const joinChallenge = async (id: string) => {
  return fetchWithCache(`${API_URL}/community/challenges/${id}/join`, { 
    method: 'POST',
    headers: getHeaders() 
  });
};
