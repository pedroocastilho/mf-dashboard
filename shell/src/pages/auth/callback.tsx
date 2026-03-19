import type { GetServerSideProps } from 'next';
import { exchangeCode } from '../../lib/keycloak';

function serializeCookie(
  name: string,
  value: string,
  options: { httpOnly?: boolean; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none'; maxAge?: number; path?: string }
) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  parts.push(`Path=${options.path ?? '/'}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite[0].toUpperCase()}${options.sameSite.slice(1)}`);
  return parts.join('; ');
}

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
  const code = typeof query.code === 'string' ? query.code : undefined;
  const error = typeof query.error === 'string' ? query.error : undefined;

  if (error) {
    return {
      redirect: {
        destination: `/auth/login?error=${encodeURIComponent(error)}`,
        permanent: false,
      },
    };
  }

  if (!code) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const host = req.headers.host ?? 'localhost:3000';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `http://${host}`;

  try {
    const tokens = await exchangeCode(code, baseUrl);
    const secure = process.env.NODE_ENV === 'production';

    const cookies = [
      serializeCookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge: tokens.expires_in,
        path: '/',
      }),
      serializeCookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge: tokens.refresh_expires_in,
        path: '/',
      }),
    ];

    res.setHeader('Set-Cookie', cookies);
  } catch {
    return {
      redirect: {
        destination: '/auth/login?error=token_exchange_failed',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  };
};

export default function CallbackPage() {
  return null;
}
