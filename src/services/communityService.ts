import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchCommunityStats = async () => {
  const response = await fetch(`${API_URL}/community/stats`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch community stats');
  return response.json();
};

export const fetchLeaderboard = async () => {
  const response = await fetch(`${API_URL}/community/leaderboard`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
};

export const fetchCommunityFeed = async () => {
  const response = await fetch(`${API_URL}/community/feed`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch community feed');
  return response.json();
};

export const fetchCommunityChallenges = async () => {
  const response = await fetch(`${API_URL}/community/challenges`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch challenges');
  return response.json();
};

export const joinChallenge = async (id: string) => {
  const response = await fetch(`${API_URL}/community/challenges/${id}/join`, { 
    method: 'POST',
    headers: getHeaders() 
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to join challenge');
  }
  return response.json();
};
