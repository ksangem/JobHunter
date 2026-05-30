import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('jh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, _password: string, role: UserRole) => {
    // Simulated login — replace with real API call
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role,
    };
    sessionStorage.setItem('jh_user', JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
    };
    sessionStorage.setItem('jh_user', JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('jh_user');
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      sessionStorage.setItem('jh_user', JSON.stringify(updated));
      setUser(updated);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
