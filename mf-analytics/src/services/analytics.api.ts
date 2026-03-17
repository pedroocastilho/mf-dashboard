// mf-analytics/src/services/analytics.api.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
});

// Injeta o token de autorização em todas as requisições
api.interceptors.request.use((config) => {
  // Tenta obter o token do Zustand store (compartilhado via Module Federation)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = (window as any).__AUTH_STORE__;
    if (store?.token) {
      config.headers.Authorization = `Bearer ${store.token}`;
    }
  } catch {}
  return config;
});

export interface AnalyticsSummary {
  totalAcessos: number;
  usuariosUnicos: number;
  taxaConversao: number;
  crescimento: number;
}

export interface DailyClick {
  date: string;
  count: number;
}

export interface DeviceData {
  device: string;
  count: number;
}

// ── Query functions ───────────────────────────────────────────────────────
async function fetchSummary(): Promise<AnalyticsSummary> {
  const { data } = await api.get('/api/analytics/summary');
  return data;
}

async function fetchClicks(days: number): Promise<DailyClick[]> {
  const { data } = await api.get(`/api/analytics/clicks?days=${days}`);
  return data;
}

async function fetchDevices(): Promise<DeviceData[]> {
  const { data } = await api.get('/api/analytics/devices');
  return data;
}

// ── React Query Hooks ─────────────────────────────────────────────────────
export function useSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchSummary,
    refetchInterval: 60_000, // Atualiza automaticamente a cada 60 segundos
    // Dados mock para demo sem backend real
    placeholderData: {
      totalAcessos: 12_840,
      usuariosUnicos: 3_291,
      taxaConversao: 4.7,
      crescimento: 12.3,
    },
  });
}

export function useClicks(days: number) {
  return useQuery({
    queryKey: ['analytics', 'clicks', days],
    queryFn: () => fetchClicks(days),
    refetchInterval: 60_000,
    placeholderData: generateMockClicks(days),
  });
}

export function useDevices() {
  return useQuery({
    queryKey: ['analytics', 'devices'],
    queryFn: fetchDevices,
    refetchInterval: 60_000,
    placeholderData: [
      { device: 'Desktop', count: 6842 },
      { device: 'Mobile',  count: 4129 },
      { device: 'Tablet',  count: 1869 },
    ],
  });
}

// Gera dados mock realistas para demo
function generateMockClicks(days: number): DailyClick[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date:  date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 600 + 200),
    };
  });
}
