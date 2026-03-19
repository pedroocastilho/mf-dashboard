// mf-users/src/components/Users.tsx
'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { UserForm } from './UserForm';
import type { User } from '../types';

// Mock data para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Admin User',
    email: 'admin@example.com',
    roles: ['admin'],
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Viewer User',
    email: 'viewer@example.com',
    roles: ['viewer'],
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      if (selectedUser) {
        // Editar usuário existente
        setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, ...data } : u)));
      } else {
        // Criar novo usuário
        const newUser: User = {
          ...data,
          id: Date.now().toString(),
          criadoEm: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: User['status']) => {
    const colors = {
      ativo: { bg: '#F0FDF4', color: '#15803D' },
      inativo: { bg: '#FEF2F2', color: '#DC2626' },
      pendente: { bg: '#FFFBEB', color: '#D97706' },
    };
    return colors[status];
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? { bg: '#EFF6FF', color: '#1D4ED8' }
      : { bg: '#F0FDF4', color: '#15803D' };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ background: '#1E3A5F' }}
        >
          Novo usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    {user.roles.map((role) => {
                      const colors = getRoleColor(role);
                      return (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          sx={{ background: colors.bg, color: colors.color }}
                        />
                      );
                    })}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    sx={getStatusColor(user.status)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(user)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => user.id && handleDelete(user.id)} 
                    size="small" 
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserForm
        open={isFormOpen}
        user={selectedUser}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Users;
