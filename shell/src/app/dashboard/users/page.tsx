'use client';
// shell/src/app/dashboard/users/page.tsx
import Box from '@mui/material/Box';
import { Header } from '../../../components/Header';
import { RemoteModule } from '../../../components/RemoteModule';

export default function UsersPage() {
  return (
    <Box>
      <Header title="Gestão de Usuários" />
      <Box p={3}>
        <RemoteModule module="mfUsers/Users" />
      </Box>
    </Box>
  );
}
