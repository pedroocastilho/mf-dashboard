// shell/src/lib/keycloak.ts

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export const keycloakConfig = {
  realm:    process.env.KEYCLOAK_REALM    ?? 'mf-dashboard',
  clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'shell-client',
  secret:   process.env.KEYCLOAK_CLIENT_SECRET ?? '',
  url:      process.env.KEYCLOAK_URL       ?? 'http://localhost:8080',
};

/** URL de login — redireciona o usuário para a tela de login do Keycloak */
export function buildLoginUrl(baseUrl: string): string {
  const params = new URLSearchParams({
    client_id:     keycloakConfig.clientId,
    redirect_uri:  `${baseUrl}/auth/callback`,
    response_type: 'code',
    scope:         'openid profile email roles',
  });

  return `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?${params}`;
}

/** URL de logout — invalida a sessão no Keycloak */
export function buildLogoutUrl(baseUrl: string, refreshToken?: string): string {
  const params = new URLSearchParams({
    client_id:     keycloakConfig.clientId,
    post_logout_redirect_uri: `${baseUrl}/auth/login`,
  });
  if (refreshToken) params.set('refresh_token', refreshToken);

  return `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout?${params}`;
}

/** Troca o authorization_code por access_token + refresh_token */
export async function exchangeCode(code: string, baseUrl: string): Promise<Tokens> {
  const res = await fetch(
    `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        client_id:     keycloakConfig.clientId,
        client_secret: keycloakConfig.secret,
        code,
        redirect_uri:  `${baseUrl}/auth/callback`,
      }).toString(),
    }
  );
  if (!res.ok) throw new Error(`Falha ao trocar código por token: ${res.status}`);
  return res.json();
}

export async function refreshAccessToken(token: string): Promise<Tokens> {
  const res = await fetch(
    `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'refresh_token',
        client_id:     keycloakConfig.clientId,
        client_secret: keycloakConfig.secret,
        refresh_token: token,
      }).toString(),
    }
  );
  if (!res.ok) throw new Error(`Falha ao renovar token: ${res.status}`);
  return res.json();
}
