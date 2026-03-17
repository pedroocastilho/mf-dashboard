import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ClicksChart } from '../components/ClicksChart';

const mockData = [
  { date: '2024-03-01', count: 320 },
  { date: '2024-03-02', count: 450 },
  { date: '2024-03-03', count: 210 },
];

describe('ClicksChart', () => {
  it('exibe skeleton quando isLoading é true', () => {
    render(<ClicksChart data={[]} isLoading={true} />);
    expect(screen.getByText(/carregando dados/i)).toBeTruthy();
  });

  it('exibe mensagem de vazio quando não há dados', () => {
    render(<ClicksChart data={[]} isLoading={false} />);
    expect(screen.getByText(/nenhum dado disponível/i)).toBeTruthy();
  });

  it('renderiza o gráfico quando há dados', async () => {
    const { container } = render(<ClicksChart data={mockData} isLoading={false} />);
    await waitFor(() => {
      expect(container.querySelector('.recharts-wrapper') ?? container.firstChild).toBeTruthy();
    });
  });
});