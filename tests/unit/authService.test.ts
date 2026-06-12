import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../src/services/authService';
import { apiClient } from '../../src/lib/apiClient';

vi.mock('../../src/lib/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  }
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockResponse = { token: 'fake-token', user: { id: '1', name: 'Test' } };
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.login('test@test.com', 'password123');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password123' });
    expect(result).toEqual(mockResponse);
  });

  it('should register successfully', async () => {
    const mockResponse = { token: 'fake-token', user: { id: '1', name: 'Test' } };
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.register('Test', 'test@test.com', 'password123');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', { name: 'Test', email: 'test@test.com', password: 'password123' });
    expect(result).toEqual(mockResponse);
  });
});
