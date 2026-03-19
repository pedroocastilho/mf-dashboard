import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('RemoteModule', () => {
  it('exibe o skeleton de loading enquanto o módulo carrega', async () => {
    vi.doMock('mfAnalytics/Analytics', () => ({
      default: () => <div data-testid="remote-analytics">Analytics carregado</div>,
    }));

    const { RemoteModule } = await import('../../src/components/RemoteModule');
    render(<RemoteModule module="mfAnalytics/Analytics" />);
    expect(screen.getByText(/carregando módulo/i)).toBeTruthy();
    await screen.findByTestId('remote-analytics');
  });

  it('renderiza o componente remoto após carregamento', async () => {
    vi.doMock('mfAnalytics/Analytics', () => ({
      default: () => <div data-testid="remote-analytics">Analytics carregado</div>,
    }));

    const { RemoteModule } = await import('../../src/components/RemoteModule');
    render(<RemoteModule module="mfAnalytics/Analytics" />);
    const component = await screen.findByTestId('remote-analytics');
    expect(component).toBeTruthy();
  });

  it('exibe mensagem de erro quando o módulo falha ao carregar', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.doMock('mfUsers/Users', () => ({
      default: () => {
        throw new Error('Falha ao carregar módulo remoto');
      },
    }));

    const { RemoteModule } = await import('../../src/components/RemoteModule');
    render(<RemoteModule module="mfUsers/Users" />);
    const errorMsg = await screen.findByText(/erro ao carregar módulo/i);
    expect(errorMsg).toBeTruthy();
  });

  it('aceita fallback customizado via prop', async () => {
    vi.doMock('mfAnalytics/Analytics', () => ({
      default: () => <div data-testid="remote-analytics">Analytics carregado</div>,
    }));

    const { RemoteModule } = await import('../../src/components/RemoteModule');
    render(
      <RemoteModule
        module="mfAnalytics/Analytics"
        fallback={<div>Carregando customizado...</div>}
      />
    );
    expect(screen.getByText('Carregando customizado...')).toBeTruthy();
    await screen.findByTestId('remote-analytics');
  });
});
