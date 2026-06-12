import { setToken, setUser, logout as localLogout } from '../utils/auth';
import { apiClient } from '../lib/apiClient';

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: unknown;
  data?: unknown;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/login', { email, password });

    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user || data.data);
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
