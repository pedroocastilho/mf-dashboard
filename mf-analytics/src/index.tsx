// mf-analytics/src/index.tsx
// Este é o ponto de entrada exposto via Module Federation.
// O shell importa este componente dinamicamente em runtime.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { KpiCards } from './components/KpiCards';
import { ClicksChart } from './components/ClicksChart';
import { DevicesChart } from './components/DevicesChart';
import { useSummary, useClicks, useDevices } from './services/analytics.api';

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '20px 24px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const PERIOD_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '15 dias', value: 15 },
  { label: '30 dias', value: 30 },
];

function AnalyticsDashboard() {
  const [period, setPeriod] = useState(30);
  const summary = useSummary();
  const clicks  = useClicks(period);
  const devices = useDevices();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Cards */}
      <KpiCards
        data={summary.data ?? { totalAcessos: 0, usuariosUnicos: 0, taxaConversao: 0, crescimento: 0 }}
        isLoading={summary.isLoading}
      />

      {/* Cliques ao longo do tempo */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' }}>
            Acessos ao longo do tempo
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: period === opt.value ? '#2E75B6' : '#E5E7EB',
                  background: period === opt.value ? '#EFF6FF' : '#fff',
                  color: period === opt.value ? '#2E75B6' : '#6B7280',
                  fontSize: 13,
                  fontWeight: period === opt.value ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <ClicksChart data={clicks.data ?? []} isLoading={clicks.isLoading} />
      </div>

      {/* Dispositivos */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#111827' }}>
          Distribuição por Dispositivo
        </h3>
        <DevicesChart data={devices.data ?? []} isLoading={devices.isLoading} />
      </div>
    </div>
  );
}

// Wrapper com QueryClientProvider — cada MF tem seu próprio client
// mas compartilha o Zustand store com o shell via singleton
export default function Analytics() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsDashboard />
    </QueryClientProvider>
  );
}
