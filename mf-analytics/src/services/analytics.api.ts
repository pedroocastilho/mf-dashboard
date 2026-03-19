// mf-analytics/src/services/analytics.api.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
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

// ── Placeholder data estável (gerada uma única vez, fora dos hooks) ───────
const PLACEHOLDER_SUMMARY: AnalyticsSummary = {
  totalAcessos: 12_840,
  usuariosUnicos: 3_291,
  taxaConversao: 4.7,
  crescimento: 12.3,
};

const PLACEHOLDER_DEVICES: DeviceData[] = [
  { device: 'Desktop', count: 6842 },
  { device: 'Mobile',  count: 4129 },
  { device: 'Tablet',  count: 1869 },
];

function generateMockClicks(days: number): DailyClick[] {
  const seed = days * 31;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + i);
    // Pseudo-random estável baseado em seed — sem Math.random()
    const count = 200 + ((seed * (i + 1) * 2654435761) >>> 0) % 600;
    return {
      date: date.toISOString().split('T')[0],
      count,
    };
  });
}

const PLACEHOLDER_CLICKS: Record<number, DailyClick[]> = {
  7:  generateMockClicks(7),
  15: generateMockClicks(15),
  30: generateMockClicks(30),
};

// ── React Query Hooks ─────────────────────────────────────────────────────
export function useSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchSummary,
    retry: false,
    initialData: PLACEHOLDER_SUMMARY,
  });
}

export function useClicks(days: number) {
  return useQuery({
    queryKey: ['analytics', 'clicks', days],
    queryFn: () => fetchClicks(days),
    retry: false,
    initialData: PLACEHOLDER_CLICKS[days] ?? generateMockClicks(days),
  });
}

export function useDevices() {
  return useQuery({
    queryKey: ['analytics', 'devices'],
    queryFn: fetchDevices,
    retry: false,
    initialData: PLACEHOLDER_DEVICES,
  });
}