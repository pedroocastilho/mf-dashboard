// shell/src/lib/auth.ts
import { jwtVerify, decodeJwt } from 'jose';

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  preferred_username: string;
  roles: string[];
}

/** Decodifica o JWT sem verificação (uso no cliente) */
export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = decodeJwt(token);
    const realmAccess = payload.realm_access as { roles?: string[] } | undefined;

    return {
      sub:                payload.sub ?? '',
      name:               (payload.name as string) ?? '',
      email:              (payload.email as string) ?? '',
      preferred_username: (payload.preferred_username as string) ?? '',
      roles:              realmAccess?.roles ?? [],
    };
  } catch {
    return null;
  }
}

/** Verifica se o token está expirado */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    const exp = payload.exp as number | undefined;
    if (!exp) return true;
    // Considera expirado 30 segundos antes para evitar edge cases
    return Date.now() / 1000 > exp - 30;
  } catch {
    return true;
  }
}

/** Verifica se o usuário tem a role especificada */
export function hasRole(user: AuthUser | null, role: string): boolean {
  return user?.roles.includes(role) ?? false;
}
