// mf-analytics/src/components/DevicesChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DeviceData } from '../services/analytics.api';

const COLORS: Record<string, string> = {
  Desktop: '#2E75B6',
  Mobile:  '#7C3AED',
  Tablet:  '#D97706',
};
const FALLBACK = ['#2E75B6', '#7C3AED', '#D97706', '#059669'];

interface DevicesChartProps {
  data: DeviceData[];
  isLoading: boolean;
}

export function DevicesChart({ data, isLoading }: DevicesChartProps) {
  if (isLoading) {
    return (
      <div
        style={{
          height: 280,
          background: '#F9FAFB',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
          fontSize: 14,
        }}
      >
        Carregando dados...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        style={{
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
          fontSize: 14,
        }}
      >
        Nenhum dado de dispositivo disponível.
      </div>
    );
  }

  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={65}
          outerRadius={100}
          dataKey="count"
          nameKey="device"
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.device}
              fill={COLORS[entry.device] ?? FALLBACK[i % FALLBACK.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13 }}
          formatter={(value: number, name: string) => [
            `${value.toLocaleString('pt-BR')} (${((value / total) * 100).toFixed(1)}%)`,
            name,
          ]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: '#6B7280' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
