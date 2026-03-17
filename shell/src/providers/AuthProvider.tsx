'use client';
// shell/src/providers/AuthProvider.tsx
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { decodeToken } from '../lib/auth';

interface AuthProviderProps {
  accessToken?: string;
  children: React.ReactNode;
}

/**
 * Inicializa o Zustand store com o token vindo dos cookies (via Server Component).
 * Os micro-frontends acessam o mesmo store via Module Federation singleton.
 */
export function AuthProvider({ accessToken, children }: AuthProviderProps) {
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      const user = decodeToken(accessToken);
      if (user) {
        setAuth(accessToken, user);
        return;
      }
    }
    clearAuth();
  }, [accessToken, setAuth, clearAuth]);

  return <>{children}</>;
}
