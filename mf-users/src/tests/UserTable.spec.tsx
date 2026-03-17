import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserTable } from '../components/UserTable';
import type { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Pedro Castilho',
    email: 'pedro@castilhodev.com.br',
    status: 'ativo',
    roles: ['admin', 'viewer'],
    criadoEm: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Ana Paula',
    email: 'ana@castilhodev.com.br',
    status: 'inativo',
    roles: ['viewer'],
    criadoEm: '2024-02-15T08:30:00Z',
  },
];

const defaultProps = {
  users: mockUsers,
  total: 2,
  page: 1,
  limit: 10,
  isLoading: false,
  onPageChange: vi.fn(),
  onLimitChange: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('UserTable', () => {
  it('exibe skeletons quando isLoading é true', () => {
    render(<UserTable {...defaultProps} users={[]} isLoading={true} />);
    expect(screen.getByText('Nome')).toBeTruthy();
  });

  it('renderiza os usuários corretamente', () => {
    render(<UserTable {...defaultProps} />);
    expect(screen.getByText('Pedro Castilho')).toBeTruthy();
    expect(screen.getByText('pedro@castilhodev.com.br')).toBeTruthy();
    expect(screen.getByText('Ana Paula')).toBeTruthy();
  });

  it('exibe o status de cada usuário como chip', () => {
    render(<UserTable {...defaultProps} />);
    expect(screen.getByText('ativo')).toBeTruthy();
    expect(screen.getByText('inativo')).toBeTruthy();
  });

  it('chama onEdit quando o botão de editar é clicado', () => {
    const onEdit = vi.fn();
    render(<UserTable {...defaultProps} onEdit={onEdit} />);
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('chama onDelete quando o botão de excluir é clicado', () => {
    const onDelete = vi.fn();
    render(<UserTable {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('exibe mensagem de lista vazia quando não há usuários', () => {
    render(<UserTable {...defaultProps} users={[]} total={0} />);
    expect(screen.getByText(/nenhum usuário encontrado/i)).toBeTruthy();
  });

  it('exibe os cabeçalhos corretos', () => {
    render(<UserTable {...defaultProps} />);
    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Roles')).toBeTruthy();
    expect(screen.getByText('Criado em')).toBeTruthy();
    expect(screen.getByText('Ações')).toBeTruthy();
  });
});