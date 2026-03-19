'use client';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Header } from '../../components/Header';

const RemoteModule = dynamic(
  () => import('../../components/RemoteModule').then((m) => m.RemoteModule),
  {
    ssr: false,
    loading: () => (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={300} gap={2}>
        <CircularProgress size={32} sx={{ color: '#2E75B6' }} />
        <Typography variant="body2" color="text.secondary">
          Carregando módulo...
        </Typography>
      </Box>
    ),
  }
);

export default function UsersPage() {
  return (
    <DashboardLayout>
      <Box>
        <Header title="Gestão de Usuários" />
        <Box p={3}>
          <RemoteModule module="mfUsers/Users" />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
