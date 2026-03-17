// shell/tests/unit/auth.store.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../src/store/auth.store';

const mockUser = {
  sub: 'user-123',
  name: 'Pedro Castilho',
  email: 'pedro@castilhodev.com.br',
  preferred_username: 'pedro',
  roles: ['admin', 'viewer'],
};

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reseta o store antes de cada teste
    useAuthStore.setState({ token: null, user: null, isLoading: true });
  });

  it('inicializa com estado vazio', () => {
    const { token, user } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('setAuth armazena token e usuário corretamente', () => {
    const { setAuth } = useAuthStore.getState();
    setAuth('token-abc-123', mockUser);

    const { token, user, isLoading } = useAuthStore.getState();
    expect(token).toBe('token-abc-123');
    expect(user).toEqual(mockUser);
    expect(isLoading).toBe(false);
  });

  it('clearAuth remove token e usuário', () => {
    useAuthStore.setState({ token: 'token-abc', user: mockUser, isLoading: false });

    const { clearAuth } = useAuthStore.getState();
    clearAuth();

    const { token, user } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('setLoading atualiza o estado de carregamento', () => {
    const { setLoading } = useAuthStore.getState();
    setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('seletores retornam os valores corretos após setAuth', () => {
    useAuthStore.getState().setAuth('my-token', mockUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe('my-token');
    expect(state.user?.roles).toContain('admin');
    expect(state.user?.email).toBe('pedro@castilhodev.com.br');
  });
});
