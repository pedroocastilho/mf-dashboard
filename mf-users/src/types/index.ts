// mf-users/src/types/index.ts
export type UserStatus = 'ativo' | 'inativo' | 'pendente';
export type UserRole   = 'admin' | 'viewer';

export interface User {
  id: string;
  nome: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  criadoEm: string;
}

export interface CreateUserPayload {
  nome: string;
  email: string;
  senha: string;
  roles: UserRole[];
}

export interface UpdateUserPayload {
  nome?: string;
  email?: string;
  status?: UserStatus;
  roles?: UserRole[];
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
