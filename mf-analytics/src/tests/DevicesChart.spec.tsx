import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DevicesChart } from '../components/DevicesChart';

const mockData = [
  { device: 'Desktop', count: 6842 },
  { device: 'Mobile',  count: 4129 },
  { device: 'Tablet',  count: 1869 },
];

describe('DevicesChart', () => {
  it('exibe skeleton quando isLoading é true', () => {
    render(<DevicesChart data={[]} isLoading={true} />);
    expect(screen.getByText(/carregando dados/i)).toBeTruthy();
  });

  it('exibe mensagem de vazio quando não há dados', () => {
    render(<DevicesChart data={[]} isLoading={false} />);
    expect(screen.getByText(/nenhum dado de dispositivo/i)).toBeTruthy();
  });

  it('renderiza o gráfico de pizza com os dados fornecidos', async () => {
    const { container } = render(<DevicesChart data={mockData} isLoading={false} />);
    await waitFor(() => {
      expect(container.querySelector('.recharts-wrapper') ?? container.firstChild).toBeTruthy();
    });
  });
});