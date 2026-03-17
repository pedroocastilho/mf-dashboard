// shell/src/app/auth/callback/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { exchangeCode } from '../../../lib/keycloak';

interface CallbackPageProps {
  searchParams: { code?: string; error?: string; next?: string };
}

export default async function CallbackPage({ searchParams }: CallbackPageProps) {
  const { code, error } = searchParams;

  if (error) {
    redirect(`/auth/login?error=${error}`);
  }

  if (!code) {
    redirect('/auth/login');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  try {
    const tokens = await exchangeCode(code, baseUrl);
    const cookieStore = cookies();

    // Salva os tokens em cookies HttpOnly — inacessíveis pelo JavaScript do cliente
    cookieStore.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   tokens.expires_in,
      path:     '/',
    });

    cookieStore.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   tokens.refresh_expires_in,
      path:     '/',
    });
  } catch {
    redirect('/auth/login?error=token_exchange_failed');
  }

  redirect('/dashboard');
}
