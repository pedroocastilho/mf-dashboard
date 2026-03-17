// shell/tests/unit/auth.spec.ts
import { describe, it, expect } from 'vitest';
import { decodeToken, isTokenExpired, hasRole } from '../../src/lib/auth';

// JWT válido com payload conhecido (gerado para testes — não usar em produção)
// Payload: { sub: "user-1", name: "Pedro", email: "pedro@test.com",
//            preferred_username: "pedro", realm_access: { roles: ["admin","viewer"] },
//            exp: 9999999999 }
const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTEiLCJuYW1lIjoiUGVkcm8iLCJlbWFpbCI6InBlZHJvQHRlc3QuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicGVkcm8iLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iLCJ2aWV3ZXIiXX0sImV4cCI6OTk5OTk5OTk5OX0.' +
  'signature';

// JWT com exp no passado
const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTIiLCJleHAiOjE2MDAwMDAwMDB9.' +
  'signature';

describe('decodeToken', () => {
  it('decodifica um JWT válido e extrai os campos corretamente', () => {
    const user = decodeToken(VALID_TOKEN);
    expect(user).not.toBeNull();
    expect(user?.sub).toBe('user-1');
    expect(user?.name).toBe('Pedro');
    expect(user?.email).toBe('pedro@test.com');
    expect(user?.roles).toContain('admin');
    expect(user?.roles).toContain('viewer');
  });

  it('retorna null para um token malformado', () => {
    expect(decodeToken('nao-e-um-jwt')).toBeNull();
    expect(decodeToken('')).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('retorna false para token com exp no futuro', () => {
    expect(isTokenExpired(VALID_TOKEN)).toBe(false);
  });

  it('retorna true para token com exp no passado', () => {
    expect(isTokenExpired(EXPIRED_TOKEN)).toBe(true);
  });

  it('retorna true para token malformado', () => {
    expect(isTokenExpired('token-invalido')).toBe(true);
  });
});

describe('hasRole', () => {
  const adminUser = {
    sub: '1', name: 'Admin', email: 'a@b.com',
    preferred_username: 'admin', roles: ['admin', 'viewer'],
  };

  it('retorna true quando o usuário tem a role', () => {
    expect(hasRole(adminUser, 'admin')).toBe(true);
    expect(hasRole(adminUser, 'viewer')).toBe(true);
  });

  it('retorna false quando o usuário não tem a role', () => {
    expect(hasRole(adminUser, 'superadmin')).toBe(false);
  });

  it('retorna false para usuário nulo', () => {
    expect(hasRole(null, 'admin')).toBe(false);
  });
});
