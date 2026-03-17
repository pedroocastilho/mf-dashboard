// shell/src/store/auth.store.ts
// Este store é compartilhado via Module Federation como singleton.
// Todos os micro-frontends acessam o mesmo estado de autenticação.
import { create } from 'zustand';
import type { AuthUser } from '../lib/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  setAuth: (token, user) => set({ token, user, isLoading: false }),
  clearAuth: () => set({ token: null, user: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
