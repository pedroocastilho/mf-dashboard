import type { GetServerSideProps } from 'next';
import { buildLogoutUrl } from '../../lib/keycloak';

function getCookieValue(cookieHeader: string, name: string) {
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
}

function clearCookie(name: string, secure: boolean) {
  return `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookieHeader = req.headers.cookie ?? '';
  const refreshToken = getCookieValue(cookieHeader, 'refresh_token');
  const host = req.headers.host ?? 'localhost:3000';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `http://${host}`;
  const secure = process.env.NODE_ENV === 'production';

  res.setHeader('Set-Cookie', [clearCookie('access_token', secure), clearCookie('refresh_token', secure)]);

  return {
    redirect: {
      destination: buildLogoutUrl(baseUrl, refreshToken),
      permanent: false,
    },
  };
};

export default function LogoutPage() {
  return null;
}
