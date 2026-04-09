import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  getSession,
  registerUser,
  setSession,
  verifyLogin,
  type SessionUser,
} from '@/lib/authStorage';

interface AuthContextType {
  user: SessionUser | null;
  isReady: boolean;
  login: (admissionNo: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (name: string, admissionNo: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setIsReady(true);
  }, []);

  const login = useCallback((admissionNo: string, password: string) => {
    const result = verifyLogin(admissionNo, password);
    if (result.ok) {
      setSession(result.user);
      setUser(result.user);
      return { ok: true as const };
    }
    return result;
  }, []);

  const register = useCallback((name: string, admissionNo: string, password: string) => {
    const result = registerUser(name, admissionNo, password);
    if (!result.ok) return result;
    const session: SessionUser = {
      name: name.trim(),
      admissionNo: admissionNo.trim(),
    };
    setSession(session);
    setUser(session);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, login, register, logout }),
    [user, isReady, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
