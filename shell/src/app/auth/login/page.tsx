// shell/src/app/auth/login/page.tsx
import { buildLoginUrl } from '../../../lib/keycloak';

export default function LoginPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const loginUrl = buildLoginUrl(baseUrl);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2E75B6 100%)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '48px 40px',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #1E3A5F, #2E75B6)',
              borderRadius: 16,
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 28 }}>🔐</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1E3A5F', margin: '0 0 8px' }}>
            MF Dashboard
          </h1>
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>
            Autenticação via Keycloak
          </p>
        </div>

        <a
          href={loginUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '14px 24px',
            background: '#1E3A5F',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          Entrar com Keycloak
        </a>

        <div
          style={{
            marginTop: 24,
            padding: '16px',
            background: '#F0F4FF',
            borderRadius: 8,
            fontSize: 12,
            color: '#6B7280',
            textAlign: 'left',
          }}
        >
          <strong style={{ color: '#1E3A5F' }}>Credenciais de demo:</strong>
          <br />
          Admin: <code>admin</code> / <code>admin123</code>
          <br />
          Viewer: <code>viewer</code> / <code>viewer123</code>
        </div>
      </div>
    </main>
  );
}
