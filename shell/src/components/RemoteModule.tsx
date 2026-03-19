// shell/src/components/RemoteModule.tsx
'use client';
import React, { Suspense, Component, lazy } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface RemoteModuleProps {
  module: string;
  fallback?: React.ReactNode;
  [key: string]: unknown;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class RemoteErrorBoundary extends Component<
  { children: React.ReactNode; moduleName: string },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight={200}
          gap={2}
          p={3}
          sx={{ background: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}
        >
          <Typography color="error" fontWeight={600}>
            Erro ao carregar módulo: {this.props.moduleName}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {this.state.error?.message ?? 'Verifique se o serviço está rodando.'}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => this.setState({ hasError: false })}
          >
            Tentar novamente
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

function LoadingSkeleton() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight={300} gap={2}>
      <CircularProgress size={32} sx={{ color: '#2E75B6' }} />
      <Typography variant="body2" color="text.secondary">
        Carregando módulo...
      </Typography>
    </Box>
  );
}

// Mapeamento de módulos do Module Federation
const moduleCache = new Map<string, React.LazyExoticComponent<React.ComponentType<unknown>>>();

function getRemoteComponent(moduleName: string) {
  if (!moduleCache.has(moduleName)) {
    const Component = lazy(() => {
      try {
        // Usa o Module Federation do webpack
        // @ts-ignore
        return import(/* webpackChunkName: "remote-module" */ moduleName);
      } catch (error) {
        console.error(`[RemoteModule] Falha ao carregar ${moduleName}:`, error);
        throw error;
      }
    });
    moduleCache.set(moduleName, Component);
  }
  return moduleCache.get(moduleName)!;
}

export function RemoteModule({ module: moduleName, fallback, ...props }: RemoteModuleProps) {
  const RemoteComponent = getRemoteComponent(moduleName);

  return (
    <RemoteErrorBoundary moduleName={moduleName}>
      <Suspense fallback={fallback ?? <LoadingSkeleton />}>
        <RemoteComponent {...props} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}