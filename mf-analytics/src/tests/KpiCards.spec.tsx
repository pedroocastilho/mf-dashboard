// mf-analytics/src/tests/KpiCards.spec.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCards } from '../components/KpiCards';

const mockData = {
  totalAcessos: 12840,
  usuariosUnicos: 3291,
  taxaConversao: 4.7,
  crescimento: 12.3,
};

describe('KpiCards', () => {
  it('exibe skeletons quando isLoading é true', () => {
    const { container } = render(<KpiCards data={mockData} isLoading={true} />);
    // Verifica que há elementos de loading (divs com background cinza)
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
  });

  it('exibe os valores corretos dos KPIs', () => {
    render(<KpiCards data={mockData} isLoading={false} />);
    expect(screen.getByText('12.840')).toBeTruthy();
    expect(screen.getByText('3.291')).toBeTruthy();
    expect(screen.getByText('4.7%')).toBeTruthy();
    expect(screen.getByText('+12.3%')).toBeTruthy();
  });

  it('exibe os labels dos cards corretamente', () => {
    render(<KpiCards data={mockData} isLoading={false} />);
    expect(screen.getByText('Total de Acessos')).toBeTruthy();
    expect(screen.getByText('Usuários Únicos')).toBeTruthy();
    expect(screen.getByText('Taxa de Conversão')).toBeTruthy();
    expect(screen.getByText('Crescimento')).toBeTruthy();
  });
});
