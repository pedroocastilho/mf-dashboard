import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../providers/AuthProvider';
import { QueryProvider } from '../providers/QueryProvider';
import { theme } from '../lib/theme';

type PageProps = {
  accessToken?: string;
};

function getCookieValue(cookieHeader: string, name: string) {
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
}

export default function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        <AuthProvider accessToken={pageProps.accessToken}>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const cookieHeader = appContext.ctx.req?.headers.cookie ?? '';
  const accessToken = getCookieValue(cookieHeader, 'access_token');

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      accessToken,
    },
  };
};
