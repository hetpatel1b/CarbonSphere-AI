export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setUser = (user: unknown) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};


export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('demoMode');
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};
