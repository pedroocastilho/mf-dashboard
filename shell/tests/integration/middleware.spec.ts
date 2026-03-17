// shell/tests/integration/middleware.spec.ts
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// JWT com exp no futuro (válido)
const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjk5OTk5OTk5OTl9.' +
  'signature';

// JWT com exp no passado (expirado)
const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTIiLCJleHAiOjE2MDAwMDAwMDB9.' +
  'signature';

const MOCK_TOKENS = {
  access_token: VALID_TOKEN,
  refresh_token: 'new-refresh',
  expires_in: 300,
  refresh_expires_in: 1800,
  token_type: 'Bearer',
};

const server = setupServer(
  http.post('http://localhost:8080/realms/mf-dashboard/protocol/openid-connect/token', () => {
    return HttpResponse.json(MOCK_TOKENS);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('isTokenExpired', () => {
  it('token com exp no futuro não está expirado', async () => {
    const { isTokenExpired } = await import('../../src/lib/auth');
    expect(isTokenExpired(VALID_TOKEN)).toBe(false);
  });

  it('token com exp no passado está expirado', async () => {
    const { isTokenExpired } = await import('../../src/lib/auth');
    expect(isTokenExpired(EXPIRED_TOKEN)).toBe(true);
  });
});

describe('Fluxo de refresh de token', () => {
  it('renova access_token com refresh_token válido', async () => {
    const { refreshAccessToken } = await import('../../src/lib/keycloak');
    const tokens = await refreshAccessToken('valid-refresh-token');
    expect(tokens.access_token).toBe(VALID_TOKEN);
  });

  it('lança erro quando refresh falha (401)', async () => {
    server.use(
      http.post(
        'http://localhost:8080/realms/mf-dashboard/protocol/openid-connect/token',
        () => new HttpResponse(null, { status: 401 })
      )
    );
    const { refreshAccessToken } = await import('../../src/lib/keycloak');
    await expect(refreshAccessToken('expired-refresh')).rejects.toThrow();
  });
});

describe('Fluxo completo de autenticação', () => {
  it('exchangeCode retorna tokens válidos', async () => {
    const { exchangeCode } = await import('../../src/lib/keycloak');
    const tokens = await exchangeCode('auth-code', 'http://localhost:3000');
    expect(tokens).toHaveProperty('access_token');
    expect(tokens).toHaveProperty('refresh_token');
    expect(tokens.expires_in).toBe(300);
  });
});
