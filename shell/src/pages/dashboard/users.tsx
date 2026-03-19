'use client';
import Box from '@mui/material/Box';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Header } from '../../components/Header';
import { RemoteModule } from '../../components/RemoteModule';

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
