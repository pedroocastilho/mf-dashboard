// shell/tests/unit/keycloak.spec.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { exchangeCode, refreshAccessToken, buildLoginUrl, buildLogoutUrl } from '../../src/lib/keycloak';

const MOCK_TOKENS = {
  access_token:       'mock-access-token',
  refresh_token:      'mock-refresh-token',
  expires_in:         300,
  refresh_expires_in: 1800,
  token_type:         'Bearer',
};

const server = setupServer(
  // Mock do endpoint de token do Keycloak
  http.post('http://localhost:8080/realms/mf-dashboard/protocol/openid-connect/token', () => {
    return HttpResponse.json(MOCK_TOKENS);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('exchangeCode', () => {
  it('troca o authorization_code por tokens com sucesso', async () => {
    const tokens = await exchangeCode('auth-code-xyz', 'http://localhost:3000');
    expect(tokens.access_token).toBe('mock-access-token');
    expect(tokens.refresh_token).toBe('mock-refresh-token');
    expect(tokens.expires_in).toBe(300);
  });

  it('lança erro quando o Keycloak retorna erro', async () => {
    server.use(
      http.post('http://localhost:8080/realms/mf-dashboard/protocol/openid-connect/token', () => {
        return new HttpResponse(null, { status: 400 });
      })
    );
    await expect(exchangeCode('invalid-code', 'http://localhost:3000')).rejects.toThrow();
  });
});

describe('refreshAccessToken', () => {
  it('renova o access_token usando o refresh_token', async () => {
    const tokens = await refreshAccessToken('my-refresh-token');
    expect(tokens.access_token).toBe('mock-access-token');
  });

  it('lança erro quando o refresh_token está expirado', async () => {
    server.use(
      http.post('http://localhost:8080/realms/mf-dashboard/protocol/openid-connect/token', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );
    await expect(refreshAccessToken('expired-token')).rejects.toThrow();
  });
});

describe('buildLoginUrl', () => {
  it('gera URL de login com os parâmetros corretos', () => {
    const url = buildLoginUrl('http://localhost:3000');
    expect(url).toContain('http://localhost:8080');
    expect(url).toContain('mf-dashboard');
    expect(url).toContain('shell-client');
    expect(url).toContain('response_type=code');
    expect(url).toContain('openid');
  });
});

describe('buildLogoutUrl', () => {
  it('gera URL de logout com redirect correto', () => {
    const url = buildLogoutUrl('http://localhost:3000');
    expect(url).toContain('logout');
    expect(url).toContain('shell-client');
  });
});
