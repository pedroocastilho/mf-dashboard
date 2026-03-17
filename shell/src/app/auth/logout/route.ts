// shell/src/app/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { buildLogoutUrl } from '../../../lib/keycloak';

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  // Limpa os cookies de autenticação
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  // Redireciona para o logout do Keycloak que invalida a sessão SSO
  const logoutUrl = buildLogoutUrl(baseUrl, refreshToken);
  return NextResponse.redirect(logoutUrl);
}
