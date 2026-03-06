import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, getUser, saveUser, removeUser, clearAllData } from '../services/storage';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (user: UserData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await getUser();
      setUser(savedUser);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: UserData) => {
    await saveUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await clearAllData();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
