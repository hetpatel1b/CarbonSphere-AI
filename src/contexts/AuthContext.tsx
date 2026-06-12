"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchProfile } from "@/services/settingsService";
import { isAuthenticated } from "@/utils/auth";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  location?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      if (isAuthenticated()) {
        const res = await fetchProfile();
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => refreshUser());
    
    // Set up an interval or global event listener if we want cross-tab sync, 
    // but for now, simple mount-time refresh + explicit refresh on settings change works.
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
