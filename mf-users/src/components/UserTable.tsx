// mf-users/src/components/UserTable.tsx
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { User } from '../types';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  ativo:    { bg: '#F0FDF4', color: '#15803D' },
  inativo:  { bg: '#FEF2F2', color: '#DC2626' },
  pendente: { bg: '#FFFBEB', color: '#D97706' },
};

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users, total, page, limit, isLoading,
  onPageChange, onLimitChange, onEdit, onDelete,
}: UserTableProps) {
  if (isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F9FAFB' }}>
              {['Nome', 'E-mail', 'Status', 'Roles', 'Criado em', 'Ações'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((__, j) => (
                  <TableCell key={j}><Skeleton variant="text" /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F9FAFB' }}>
              {['Nome', 'E-mail', 'Status', 'Roles', 'Criado em', 'Ações'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#9CA3AF' }}>
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const statusStyle = STATUS_COLORS[user.status] ?? STATUS_COLORS.inativo;
                return (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ '&:last-child td': { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: '#111827' }}>{user.nome}</TableCell>
                    <TableCell sx={{ color: '#6B7280', fontSize: 13 }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{ background: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: 11, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {user.roles.map((r) => (
                          <Chip
                            key={r}
                            label={r}
                            size="small"
                            sx={{
                              background: r === 'admin' ? '#EFF6FF' : '#F0FDF4',
                              color: r === 'admin' ? '#1D4ED8' : '#15803D',
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell sx={{ color: '#6B7280', fontSize: 13 }}>
                      {format(new Date(user.criadoEm), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEdit(user)} sx={{ color: '#2E75B6' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" onClick={() => onDelete(user)} sx={{ color: '#EF4444' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, p) => onPageChange(p + 1)}
        onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value))}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </>
  );
}
