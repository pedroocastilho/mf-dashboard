// mf-users/src/services/users.api.ts
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserPayload, UpdateUserPayload, PaginatedUsers } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
});

// Injeta Bearer token em todas as requisições
api.interceptors.request.use((config) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = (window as any).__AUTH_STORE__;
    if (store?.token) config.headers.Authorization = `Bearer ${store.token}`;
  } catch {}
  return config;
});

// ── Dados mock para demo sem backend ─────────────────────────────────────
const MOCK_USERS: User[] = [
  { id: '1', nome: 'Pedro Castilho',   email: 'admin@castilhodev.com.br',  status: 'ativo',    roles: ['admin', 'viewer'], criadoEm: '2024-01-10T10:00:00Z' },
  { id: '2', nome: 'Ana Paula',        email: 'ana@castilhodev.com.br',    status: 'ativo',    roles: ['viewer'],           criadoEm: '2024-02-15T08:30:00Z' },
  { id: '3', nome: 'Carlos Silva',     email: 'carlos@castilhodev.com.br', status: 'inativo',  roles: ['viewer'],           criadoEm: '2024-03-01T14:00:00Z' },
  { id: '4', nome: 'Maria Santos',     email: 'maria@castilhodev.com.br',  status: 'pendente', roles: ['viewer'],           criadoEm: '2024-03-20T09:15:00Z' },
  { id: '5', nome: 'João Ferreira',    email: 'joao@castilhodev.com.br',   status: 'ativo',    roles: ['admin', 'viewer'], criadoEm: '2024-04-05T11:45:00Z' },
];

// ── Query functions ───────────────────────────────────────────────────────
async function fetchUsers(page: number, limit: number, busca: string, status: string): Promise<PaginatedUsers> {
  const { data } = await api.get('/api/users', { params: { page, limit, busca, status } });
  return data;
}

async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await api.post('/api/users', payload);
  return data;
}

async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.put(`/api/users/${id}`, payload);
  return data;
}

async function deleteUser(id: string): Promise<void> {
  await api.delete(`/api/users/${id}`);
}

// ── React Query Hooks ─────────────────────────────────────────────────────
export function useUsers(page: number, limit: number, busca: string, status: string) {
  return useQuery({
    queryKey: ['users', page, limit, busca, status],
    queryFn: () => fetchUsers(page, limit, busca, status),
    placeholderData: {
      data:  MOCK_USERS.filter((u) =>
        (!busca  || u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase())) &&
        (!status || status === 'todos' || u.status === status)
      ).slice((page - 1) * limit, page * limit),
      total: MOCK_USERS.length,
      page,
      limit,
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
