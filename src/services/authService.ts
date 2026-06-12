import { setUser, logout as localLogout } from '../utils/auth';
import { apiClient } from '../lib/apiClient';
import { UserProfile } from '../types';

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfile;
  data?: UserProfile;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/login', { email, password });

    if (data.success && (data.user || data.data || data.token)) {
      const u = data.user || data.data;
      if (u) setUser(u);
    }

    return data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', { name, email, password });
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Handled silently
    }
    localLogout();
  }
};
