// shell/tests/unit/RemoteModule.spec.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RemoteModule } from '../../src/components/RemoteModule';

// Simula um módulo remoto que carrega com sucesso
vi.mock('mfAnalytics/Analytics', () => ({
  default: () => <div data-testid="remote-analytics">Analytics carregado</div>,
}));

// Simula um módulo remoto que falha
vi.mock('mfUsers/Users', () => {
  throw new Error('Falha ao carregar módulo remoto');
});

describe('RemoteModule', () => {
  it('exibe o skeleton de loading enquanto o módulo carrega', () => {
    render(<RemoteModule module="mfAnalytics/Analytics" />);
    // Suspense exibe o fallback durante o carregamento
    expect(screen.getByText(/carregando módulo/i)).toBeTruthy();
  });

  it('renderiza o componente remoto após carregamento', async () => {
    render(<RemoteModule module="mfAnalytics/Analytics" />);
    const component = await screen.findByTestId('remote-analytics');
    expect(component).toBeTruthy();
  });

  it('exibe mensagem de erro quando o módulo falha ao carregar', async () => {
    render(<RemoteModule module="mfUsers/Users" />);
    const errorMsg = await screen.findByText(/erro ao carregar módulo/i);
    expect(errorMsg).toBeTruthy();
  });

  it('aceita fallback customizado via prop', () => {
    render(
      <RemoteModule
        module="mfAnalytics/Analytics"
        fallback={<div>Carregando customizado...</div>}
      />
    );
    expect(screen.getByText('Carregando customizado...')).toBeTruthy();
  });
});
