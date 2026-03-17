// shell/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshAccessToken } from './lib/keycloak';
import { isTokenExpired } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas — não precisam de autenticação
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const accessToken  = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Sem nenhum token — redireciona para login
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Access token presente e válido — deixa passar
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // Access token expirado mas tem refresh token — renova silenciosamente
  if (refreshToken) {
    try {
      const tokens = await refreshAccessToken(refreshToken);
      const response = NextResponse.next();

      response.cookies.set('access_token', tokens.access_token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   tokens.expires_in,
        path:     '/',
      });

      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   tokens.refresh_expires_in,
        path:     '/',
      });

      return response;
    } catch {
      // Refresh falhou — redireciona para login limpando cookies
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
  }

  return NextResponse.redirect(new URL('/auth/login', request.url));
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
