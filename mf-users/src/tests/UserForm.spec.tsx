// mf-users/src/tests/UserForm.spec.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../components/UserForm';

const defaultProps = {
  open: true,
  user: null,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  isLoading: false,
};

describe('UserForm', () => {
  it('exibe título "Novo Usuário" quando user é null', () => {
    render(<UserForm {...defaultProps} />);
    expect(screen.getByText('Novo Usuário')).toBeTruthy();
  });

  it('exibe título "Editar Usuário" quando user é fornecido', () => {
    const user = {
      id: '1',
      nome: 'Pedro',
      email: 'pedro@test.com',
      status: 'ativo' as const,
      roles: ['viewer' as const],
      criadoEm: '2024-01-01T00:00:00Z',
    };
    render(<UserForm {...defaultProps} user={user} />);
    expect(screen.getByText('Editar Usuário')).toBeTruthy();
  });

  it('preenche o formulário com os dados do usuário ao editar', () => {
    const user = {
      id: '1',
      nome: 'Pedro Castilho',
      email: 'pedro@castilhodev.com.br',
      status: 'ativo' as const,
      roles: ['admin' as const],
      criadoEm: '2024-01-01T00:00:00Z',
    };
    render(<UserForm {...defaultProps} user={user} />);
    expect((screen.getByLabelText(/nome completo/i) as HTMLInputElement).value).toBe('Pedro Castilho');
    expect((screen.getByLabelText(/e-mail/i) as HTMLInputElement).value).toBe('pedro@castilhodev.com.br');
  });

  it('exibe erros de validação para campos obrigatórios vazios', async () => {
    render(<UserForm {...defaultProps} />);
    const submitButton = screen.getByRole('button', { name: /criar usuário/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome deve ter ao menos/i)).toBeTruthy();
    });
  });

  it('chama onClose quando Cancelar é clicado', () => {
    const onClose = vi.fn();
    render(<UserForm {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('desabilita o botão de submit enquanto isLoading é true', () => {
    render(<UserForm {...defaultProps} isLoading={true} />);
    const submitButton = screen.getByRole('button', { name: /salvando/i });
    expect(submitButton).toBeDisabled();
  });

  it('não exibe campo de senha ao editar', () => {
    const user = {
      id: '1', nome: 'Pedro', email: 'p@t.com',
      status: 'ativo' as const, roles: ['viewer' as const], criadoEm: '2024-01-01T00:00:00Z',
    };
    render(<UserForm {...defaultProps} user={user} />);
    expect(screen.queryByLabelText(/senha/i)).toBeNull();
  });
});
