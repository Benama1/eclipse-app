import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../api/client';

export type UserRole = 'admin' | 'collab' | 'employee';
export interface AuthUser {
  id: string; firstname: string; lastname: string; email: string;
  role: UserRole; access: 'payment' | 'dashboard' | 'both' | null; lang: string; currency: string;
}

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Seul l'Admin CE a le droit d'écrire (créer/modifier/supprimer). Exception : Chat. */
  canWrite: boolean;
  hasAccess: (perm: 'payment' | 'dashboard') => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('eclipse_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('eclipse_token'));

  useEffect(() => {
    if (token) localStorage.setItem('eclipse_token', token); else localStorage.removeItem('eclipse_token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('eclipse_user', JSON.stringify(user)); else localStorage.removeItem('eclipse_user');
  }, [user]);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.accessToken);
    setUser(data.user);
  }
  function logout() {
    setToken(null);
    setUser(null);
  }

  const canWrite = user?.role === 'admin';
  function hasAccess(perm: 'payment' | 'dashboard') {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'employee') return true;
    if (user.role === 'collab') return user.access === 'both' || user.access === perm;
    return true;
  }

  return <Ctx.Provider value={{ user, token, login, logout, canWrite, hasAccess }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
