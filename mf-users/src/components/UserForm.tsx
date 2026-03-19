// mf-users/src/components/UserForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import type { User } from '../types';
import { useEffect, useMemo } from 'react';

const schema = z.object({
  nome:  z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter ao menos 8 caracteres').optional().or(z.literal('')),
  roles: z.array(z.enum(['admin', 'viewer'])).min(1, 'Selecione ao menos uma role'),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
});

type FormValues = z.infer<typeof schema>;

interface UserFormProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
}

export function UserForm({ open, user, onClose, onSubmit, isLoading }: UserFormProps) {
  const isEditing = !!user;

  const defaultValues = useMemo<FormValues>(
    () => ({
      nome: user?.nome ?? '',
      email: user?.email ?? '',
      senha: '',
      roles: user?.roles ?? ['viewer'],
      status: user?.status ?? 'ativo',
    }),
    [user]
  );

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset(defaultValues);
  }, [defaultValues, open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#1E3A5F' }}>
        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            {...register('nome')}
            label="Nome completo"
            fullWidth
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />

          <TextField
            {...register('email')}
            label="E-mail"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {!isEditing && (
            <TextField
              {...register('senha')}
              label="Senha"
              type="password"
              fullWidth
              error={!!errors.senha}
              helperText={errors.senha?.message ?? 'Mínimo 8 caracteres'}
            />
          )}

          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.roles}>
                <InputLabel>Roles</InputLabel>
                <Select
                  {...field}
                  multiple
                  label="Roles"
                  renderValue={(selected) => (
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {(selected as string[]).map((r) => (
                        <Chip
                          key={r}
                          label={r}
                          size="small"
                          sx={{ background: r === 'admin' ? '#EFF6FF' : '#F0FDF4', color: r === 'admin' ? '#1D4ED8' : '#15803D' }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="admin">admin</MenuItem>
                  <MenuItem value="viewer">viewer</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {isEditing && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inativo">Inativo</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading} sx={{ background: '#1E3A5F' }}>
            {isLoading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar usuário'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
