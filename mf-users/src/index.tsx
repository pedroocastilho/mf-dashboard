// mf-users/src/index.tsx
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { UserTable } from './components/UserTable';
import { UserFilters } from './components/UserFilters';
import { UserForm } from './components/UserForm';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from './services/users.api';
import type { User } from './types';

const theme = createTheme({
  palette: { primary: { main: '#1E3A5F' } },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});

function UsersDashboard() {
  const [page, setPage]     = useState(1);
  const [limit, setLimit]   = useState(10);
  const [busca, setBusca]   = useState('');
  const [status, setStatus] = useState('todos');
  const [formOpen, setFormOpen]   = useState(false);
  const [editUser, setEditUser]   = useState<User | null>(null);

  const { data, isLoading } = useUsers(page, limit, busca, status);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleEdit = (user: User) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Excluir o usuário "${user.nome}"?`)) {
      deleteUser.mutate(user.id);
    }
  };

  // Exportação CSV
  const handleExportCSV = () => {
    if (!data?.data.length) return;
    const headers = ['Nome', 'E-mail', 'Status', 'Roles', 'Criado em'];
    const rows = data.data.map((u) => [
      u.nome, u.email, u.status, u.roles.join('+'), u.criadoEm,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (formData: any) => {
    if (editUser) {
      updateUser.mutate(
        { id: editUser.id, payload: formData },
        { onSuccess: () => { setFormOpen(false); setEditUser(null); } }
      );
    } else {
      createUser.mutate(formData, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <UserFilters
          busca={busca}
          status={status}
          onBuscaChange={(v) => { setBusca(v); setPage(1); }}
          onStatusChange={(v) => { setStatus(v); setPage(1); }}
        />
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            disabled={!data?.data.length}
            size="small"
          >
            Exportar CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setEditUser(null); setFormOpen(true); }}
            size="small"
            sx={{ background: '#1E3A5F' }}
          >
            Novo usuário
          </Button>
        </Box>
      </Box>

      {/* Contador */}
      <Typography variant="body2" color="text.secondary">
        {data?.total ?? 0} usuários encontrados
      </Typography>

      {/* Tabela */}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
        <UserTable
          users={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      {/* Modal de criação/edição */}
      <UserForm
        open={formOpen}
        user={editUser}
        onClose={() => { setFormOpen(false); setEditUser(null); }}
        onSubmit={handleFormSubmit}
        isLoading={createUser.isPending || updateUser.isPending}
      />
    </Box>
  );
}

export default function Users() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })
  );

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UsersDashboard />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
