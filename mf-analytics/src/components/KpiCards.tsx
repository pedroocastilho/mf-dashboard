// mf-analytics/src/components/KpiCards.tsx
import type { AnalyticsSummary } from '../services/analytics.api';

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '20px 24px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

interface KpiCardProps {
  label: string;
  value: string;
  growth?: number;
  color: string;
  icon: string;
}

function KpiCard({ label, value, growth, color, icon }: KpiCardProps) {
  const isPositive = (growth ?? 0) >= 0;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#111827' }}>
            {value}
          </p>
          {growth !== undefined && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: isPositive ? '#059669' : '#DC2626' }}>
              {isPositive ? '▲' : '▼'} {Math.abs(growth)}% vs. mês anterior
            </p>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface KpiCardsProps {
  data: AnalyticsSummary;
  isLoading: boolean;
}

export function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ ...cardStyle, height: 110, background: '#F9FAFB', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      <KpiCard
        label="Total de Acessos"
        value={data.totalAcessos.toLocaleString('pt-BR')}
        growth={data.crescimento}
        color="#2E75B6"
        icon="📊"
      />
      <KpiCard
        label="Usuários Únicos"
        value={data.usuariosUnicos.toLocaleString('pt-BR')}
        color="#7C3AED"
        icon="👥"
      />
      <KpiCard
        label="Taxa de Conversão"
        value={`${data.taxaConversao}%`}
        color="#059669"
        icon="🎯"
      />
      <KpiCard
        label="Crescimento"
        value={`+${data.crescimento}%`}
        color="#D97706"
        icon="📈"
      />
    </div>
  );
}
